// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'
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

  return {
    token,
    account,
    email,
    cart, 
    role,
    login
  }
})
