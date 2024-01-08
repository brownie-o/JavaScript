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

export const useApi = () => {
  return { api, apiAuth }
}