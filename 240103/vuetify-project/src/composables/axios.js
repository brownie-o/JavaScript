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

export const useApi = () => {
  return { api, apiAuth }
}