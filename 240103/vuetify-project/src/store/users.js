// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import UserRole from '@/enums/UserRole'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const account = ref('')
  const email = ref('')
  const cart = ref(0)
  const role = ref(UserRole.USER)

  const login = (data) => {
    token.value = data.token
    account.value = data.account
    email.value = data.email
    cart.value = data.cart
    role.value = data.role
  }

  const isLogin = computed(() => {
    return token.value.length > 0
  })

  const isAdmin = computed(() => {
    return role.value === UserRole.ADMIN
  })

  return {
    token,
    account,
    email,
    cart, 
    role,
    login,
    isLogin,
    isAdmin
  }
}, {
  // store 的設定
  persist: {
    key: '20240103', // localstorage 的 key的名稱
    paths: ['token'] // 存token就好
  }
})
