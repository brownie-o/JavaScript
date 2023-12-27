import { Schema, model, Error, ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt' // 密碼加密&比較功能的套件

// schema for cart
const cartSchema = new Schema({
  p_id: {
    type: ObjectId,
    // ID 來源是products
    ref: 'products',
    required: [true, '缺少購物車商品 ID']
  },
  quantity: {
    type: Number,
    required: [true, '缺少購物車商品數量'],
    min: [1, '購物車商品數量不能小於1']
  }
})

const schema = new Schema({
  email: {
    type: String,
    required: [true, '缺少使用者信箱'],
    unique: true, // 信箱不能重複
    validate: { // 驗證
      validator (value) {
        return validator.isEmail(value)
      },
      message: '使用者信箱格式錯誤'
    }
  },
  password: {
    // 密碼加密後文字長度會變(輸入字數不同但加密後會是固定長度)，無法在此設定minLength，要另外寫
    type: String,
    required: [true, '缺少使用者密碼']
  },
  // 需不需要同步購物車的資料
  // 需要: 存資料庫 O
  // 不需要: 存pinia就好
  cart: {
    type: [cartSchema]
  }
}, {
  // versionKey: __v (false = 停用)
  versionKey: false,
  // 紀錄資料的建立時間與最後更新時間
  timestamps: true
})

// 資料驗證完後，進資料庫之前 執行function
// 新增資料或使用 .save() 語法時會執行
// next 繼續執行下一步: 新增進資料庫
schema.pre('save', function (next) {
  // this 代表準備要被儲存的資料
  const user = this

  // 如果密碼欄位有被更改
  if (user.isModified('password')) {
    // 驗證密碼格式
    if (user.password.length >= 4 && user.password.length <= 20) {
      // if true => 加密
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      // 不成功 => 產生一個 mongoose驗證錯誤(固定寫法)
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      // 繼續下一步，拋出錯誤
      next(error)
      return
    }
  }
  // 繼續下一步
  next()
})

export default model('users', schema)
