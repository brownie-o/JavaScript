import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import users from '../models/users.js' // 要查詢是否有這個使用者

// 使用驗證策略寫自己的驗證方式
// passport.use(驗證方式名稱, 驗證策略)
passport.use('login', new passportLocal.Strategy({
  // 預設使用username和password欄位
  // 修改成目前資料庫的欄位
  usernameField: 'email',
  passwordField: 'password'
  // (done = Strategy的固定參數 = 是否完成驗證策略)
}, async (email, password, done) => {
  try {
    // 查詢有沒有符合信箱的使用者
    const user = await users.findOne({ email })
    if (!user) throw new Error('EMAIL')
    // 檢查密碼
    if (!bcrypt.compareSync(password, user.password)) throw new Error('PASSWORD')
    // 完成驗證，繼續並將資料帶入下一步
    // done(錯誤, 資料, info)
    return done(undefined, user, undefined)
  } catch (error) {
    console.log(error)
    if (error.message === 'EMAIL') {
      return done(undefined, false, { message: '信箱不存在' })
    } else if (error.message === 'PASSWORD') {
      return done(undefined, false, { message: '密碼錯誤' })
    } else {
      return done(error, false, { message: '未知錯誤' })
    }
  }
}))

passport.use('jwt', new passportJWT.Strategy({
  // 擷取jwt的位置 (從header的Authorization key 的Bearer 拉出)
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 驗證用secret
  secretOrKey: process.env.JWT_SECRET,
  // 讓後面的function能取得請求req
  passReqToCallback: true
}, async (req, payload, done) => {
  // payload解譯後的jwt內容
  try {
    // 自己從header取jwt 用空格做分段 取第二段[1]
    // const token = req.headers.authorization.split(' ')[1]
    const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    const user = await users.findOne({ _id: payload._id, tokens: token })
    if (!user) throw new Error('JWT')
    return done(undefined, { user, token }, undefined)
  } catch (error) {
    if (error.message === 'JWT') {
      return done(undefined, undefined, { message: 'JWT 無效' })
    } else {
      return done(undefined, undefined, { message: '未知錯誤' })
    }
  }
}))
