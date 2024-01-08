import { useUserStore } from "@/store/user"
import axios from "axios"

// 固定的東西 可以重複使用
const api = axios.create({
  // 以後只要寫相對路徑, baseURL(http://localhost:4000)會自動補在前面
  baseURL: import.meta.env.VITE_API
})

// 攔截器
const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API
})

// 1. 呼叫axios.get / axios.post 時
// 2. interceptors.request 請求攔截器
// 3. 送出請求
// 4. interceptors.response 回應攔截器
// 5. 呼叫的地方的 .then() .catch()
// config = 這次請求的設定
apiAuth.interceptors.request.use(config => {
  const user = useUserStore()
  config.headers.Authorization = 'Bearer ' + user.token
  return config
})

// 1. apiAuth.get('/users/me')
// 2-1. 如果不是 JWT 過期錯誤，將 apiAuth.get('/users/me') 的錯誤回傳
// 2-2. 如果發生 JWT 過期錯誤，進入 3.
// 3. 傳送舊換新請求
// 3-1. 如果舊換新成功，修改 apiAuth.get('/users/me') 的 JWT 為新的後送出
// 3-2. 如果舊換新失敗，將 apiAuth.get('/users/me') 的錯誤回傳
// apiAuth.interceptors.response(成功時執行, 失敗時執行)
apiAuth.interceptors.response.use((res)=> {
  return res
}, (error) => {
  // 如果失敗有收到回應
  if (error.response) {
    // 如果是JWT過期，且不是舊換新請求
    if (error.response.data.message === 'JWT 過期' && error.config.url !== '/users/extend' ){
      const user = useUserStore()
      // 傳送舊換新請求
      return apiAuth.patch('/users/extend')
        .then(({ data })=> {
          // 更新pinia保存的token
          user.token = data.result
          // 修改發生錯誤的原請求設定的JWT
          error.config.headers.Authorization = 'Bearer ' + user.token
          // 重新傳送原請求
          return axios(error.config)
        })
        .catch(()=> {
          // 如果舊換新失敗，登出
          user.logout()
          // 回傳原錯誤到呼叫的地方
          return Promise.reject(error)
        })
    }
  }
  // 如果請求沒回應，或不是過期的錯誤，回傳原錯誤到呼叫的地方
  return Promise.reject(error)
})

export const useApi = () => {
  return { api, apiAuth }
}