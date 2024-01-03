import axios from "axios";

export const api = axios.create({
  // 以後只要寫相對路徑, baseURL(http://localhost:4000)會自動補在前面
  baseURL: import.meta.env.VITE_API
})

