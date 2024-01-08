<template lang="pug">
VContainer
  VRow
    VCol(cols="12")
      h1 註冊
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
          label="信箱" type="email"
          v-model="email.value.value"
          :error-messages="email.errorMessage.value"
          )
        VTextField(
          label="密碼" type="password"
          minlength="4" maxlength="20" counter 
          v-model="password.value.value"
          :error-messages="password.errorMessage.value"
          )
        VTextField(
          label="確認密碼" type="password"
          minlength="4" maxlength="20" counter 
          v-model="passwordConfirm.value.value"
          :error-message="passwordConfirm.errorMessage.value"
          )
        VBtn(type="submit" color="green") 註冊
</template>

<script setup>
import validator from 'validator'
// vee-validate: vue 的表單驗證套件
import { useForm, useField } from 'vee-validate'
// yup: 資料格式的驗證
import * as yup from 'yup'
import { useRouter } from 'vue-router' // Router: 做跳頁; Route: 取這頁的route
import { useSnackbar } from 'vuetify-use-dialog'
import { useApi } from '@/composables/axios' // 不用+.js 套件有特別設定會去找特定副檔名的東西

const { api } = useApi()

const router = useRouter()
const createSnackbar = useSnackbar()

// 定義註冊表單的資料格式
const schema = yup.object({
  account: yup
    .string()
    .required('帳號為必填欄位')
    .min(4, '使用者帳號長度不符')
    .max(20, '使用者帳號長度不符'),
  email: yup
    .string()
    .required('信箱為必填欄位')
    // https://github.com/jquense/yup
    // .test(自訂驗證名稱, 錯誤訊息, 驗證function)
    .test(
      'isEmail', '信箱格式錯誤',
      (value) => {
        return validator.isEmail(value)
      }
    ),
  password: yup
    .string()
    .required('密碼為必填欄位')
    .min(4, '密碼長度不符')
    .max(20, '密碼長度不符'),
  passwordConfirm: yup
    .string()
    .required('密碼為必填欄位')
    .min(4, '密碼長度不符')
    .max(20, '密碼長度不符')
    // .oneOf 只允許符合陣列內其中一個值
    // .oneOf(陣列, 錯誤訊息)
    // .ref('password') 代表這個schema的password的欄位值
    .oneOf([yup.ref('password')], '密碼不一致')
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
const email = useField('email')
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')

// value: 表單裡面所有的值
const submit = handleSubmit(async (values) => {
  try {
    await api.post('/users', {
      account: values.account,
      email: values.email,
      password: values.password
    })
    createSnackbar({
      text: '註冊成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        loaction: 'bottom'
      }
    })
    router.push('/login')
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