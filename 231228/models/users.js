import { Schema, Error, model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const schema = new Schema({
  email: {
    type: String,
    required: [true, '缺少使用者信箱'],
    unique: true,
    validator: {
      validate (value) {
        return validator.isEmail(value)
      },
      message: '使用者信箱格式錯誤'
    }
  },
  password: {
    type: String,
    required: [true, '缺少使用者密碼']
  },
  // 大頭貼
  avatar: {
    type: String,
    // 預設大頭貼
    default () {
      // this.email 指的是同一筆資料email欄位的值
      return `https://source.boringavatars.com/beam/120/${this.email}?colors=379F7A,78AE62,BBB749,E0FBAC,1F1C0D`
    }
  },
  // 使用者訊息
  tokens: {
    // [String] : mongodb中 = 文字陣列
    type: [String]
  }
})

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  // 一定要再呼叫一次
  next()
})
export default model('users', schema)
