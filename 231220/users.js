// 定義資料庫的欄位 (mongoose套件的功能)

import { Schema, model } from 'mongoose'
import validator from 'validator'

// 定義資料結構，包含哪些欄位
const schema = new Schema({
  // 欄位名稱
  account: {
    // 資料型態設定
    type: String,
    // 設定為必填欄位 [是否必填, 設定傳出的錯誤訊息]
    required: [true, '缺少 account 欄位'],
    // 設定文字長度
    minLength: [4, 'account 必須4個字以上'],
    maxLength: [20, 'account 必須20個字以下'],
    // 欄位資料不可重複 (不能設定錯誤訊息)
    unique: true,
    // Regex
    match: [/^[A-Za-z1-9]+$/, 'account 只能是英數字'],
    // 自動去除前後空白
    trim: true
  },
  email: {
    type: String,
    required: [true, '缺少 email 欄位'],
    unique: true,
    // 自訂驗證 (mongoose的自訂驗證一定要叫 validator)
    validate: {
      // 自訂驗證 function (mongoose 固定name)
      validator (value) {
        // 套件的 validator
        return validator.isEmail(value)
      },
      // 自訂錯誤訊息
      message: 'email 欄位格式錯誤'
    }
  }

})

// 將結構轉匯成可以操作的model物件匯出
// 設定資料collection 的名字為 users (要使用複數)
export default model('users', schema)
