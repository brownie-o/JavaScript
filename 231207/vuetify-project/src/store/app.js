// Utilities 獨立於網頁之外 存資料的地方
import { defineStore } from 'pinia'

// defineStore(資料的名稱) 
export const useAppStore = defineStore('app', {
  // 1. state 存哪些東西
  state: () => ({
    number: 0
  }),
  // 2. actions 有哪些修改資料的function
  actions: {
    plus() {
      this.number++
    },
    minus() {
      this.number--
    }
  },
  // 3. getters 有哪些取資料的function
  getters: {
    square(){
      // Math.pow(被平方的數, 幾平方) 平方式
      return Math.pow(this.number, 2)
    }
  }
})
