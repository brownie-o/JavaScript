import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

export const login = (req, res, next) => {
  // 使用設定的驗證方式
  // session: false 停用cookie
  // (error, user, info) 對應到 passport.js 中 done()的參數
  passport.authenticate('login', { session: false }, (error, user, info) => {
    // error 有可能是passport.js丟出來的錯誤 也有可能會是上面驗證的錯物
    if (!user || error) {
      // Missing credentials: 進來的req.body 少了指定欄位 (沒有email 或 password)
      if (info.message === 'Missing credentials') {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '欄位錯誤'
        })
        return // 一定要return 不然就算有error也會跑next()
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message // 對應到 passport.js 的錯誤訊息 ('信箱不存在', '密碼錯誤', '未知錯誤')
        })
        return // 一定要return 不然就算有error也會跑next()
      }
    }
    // 將查詢到的使用者放入req中給後面的controller或middleware使用
    req.user = user
    // 繼續下一步
    next()
  })(req, res, next)
}

// 驗證 token
export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    console.log(error, data, info)
    if (error || !data) {
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        if (info.name === 'TokenExpiredError') {
          res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'JWT 過期'
          })
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'JWT 無效'
          })
        }
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          // passport 錯誤的 message
          message: info.message
        })
      }
      return
    }
    req.user = data.user
    req.token = data.token
    // 往下跑去profile 或 logout (users的routes)
    next()
    // 前面是一個function 所以要再把(req, res, next)參數傳入function
  })(req, res, next)
}
