<template lang="pug">
VContainer
  VRow
    VCol(cols="12")
      h1 登入
    VDivider
    VCol(cols="12")
      //- 正在送出表單時停止作用
      VForm(:disabled="isSubmitting" @submit.prevent="submit")
        //- counter 計數器
        VTextField(
          label="帳號" 
          minlength="4" maxlength="20" counter 
          v-model="account.value.value"
          :error-messages="account.errorMessage.value"
        )
        VTextField(
          label="密碼" type="password"
          minlength="4" maxlength="20" counter 
          v-model="password.value.value"
          :error-messages="password.errorMessage.value"
          )
        VBtn(type="submit" color="green") 登入
</template>

<script setup>
import validator from 'validator'
// vee-validate: vue 的表單驗證套件
import { useForm, useField } from 'vee-validate'
// yup: 資料格式的驗證
import * as yup from 'yup'
import { api } from '@/plugins/axios' // 不用+.js 套件有特別設定會去找特定副檔名的東西
import { useRouter } from 'vue-router' // Router: 做跳頁; Route: 取這頁的route
import { useSnackbar } from 'vuetify-use-dialog'

const router = useRouter()
const createSnackbar = useSnackbar()

// 定義登入表單的資料格式
const schema = yup.object({
  account: yup
    .string()
    .required('帳號為必填欄位')
    .min(4, '使用者帳號長度不符')
    .max(20, '使用者帳號長度不符'),
  password: yup
    .string()
    .required('密碼為必填欄位')
    .min(4, '密碼長度不符')
    .max(20, '密碼長度不符')
})

// 一定要先useForm 才能useField

// isSubmitting 判斷表單是否處於送出中的狀態
const { handleSubmit, isSubmitting } = useForm({
  // 驗證方式 用上面定義的驗證格式(yup)
  validationSchema: schema
})

// 建立表單欄位
// 綁定上面的schema (要跟上面的schema對到)
const account = useField('account')
const password = useField('password')

// value: 表單裡面所有的值
const submit = handleSubmit(async (values) => {
  try {
    await api.post('/users/login', {
      account: values.account,
      password: values.password
    })
    createSnackbar({
      text: '登入成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        loaction: 'bottom'
      }
    })
    router.push('/')
  } catch (error) {
    console.log(error)
    let text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
})
</script>