// Utilities
import { createPinia } from 'pinia'
import persistedstate from 'pinia-plugin-persistedstate' // 保存pinia狀態的套件

const pinia = createPinia()
pinia.use(persistedstate)

export default pinia