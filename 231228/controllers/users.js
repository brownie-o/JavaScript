import users from '../models/users.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

export const create = async (req, res) => {
  try {
    const result = await users.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號或信箱重複'
      })
    } else if (error.name === 'ValidationError') {
      // 資料驗證錯誤
      // 取出第一個驗證失敗的欄位名稱
      const key = Object.keys(error.errors)[0]
      // 再用取出的欄位名稱取錯誤訊息
      // 用變數的值取物件的key 要用[]
      const message = error.errors[key].message

      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      // 500: 伺服器錯誤
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

export const login = async (req, res) => {
  try {
    // jwt.sign(保存的資料, SECRET, 設定) 寫簽JWT時的設定
    const token = jwt.sign(
      { _id: req.user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '7 days' }
    )
    // auth.js 中 req.user = user
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤'
    })
  }
}

export const profile = (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      email: req.user.email,
      avatar: req.user.avatar
    }
  })
}

export const logout = async (req, res) => {
  try {
    // 把非這次登入的token留下 用filter創建新的token陣列 (移除此次登入的token)
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    // 儲存創建好的新token陣列
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤'
    })
  }
}

export const avatar = async (req, res) => {
  try {
    // {
    //   fieldname: 'image',
    //   originalname: '0103.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   path: 'https://res.cloudinary.com/dlxgomhj9/image/upload/v1703748835/cfaoagrxsuykisakefgw.jpg',
    //   size: 59884,
    //   filename: 'cfaoagrxsuykisakefgw'
    // }
    console.log(req.file)
    req.user.avatar = req.file.path
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.avatar
    })
  } catch (error) {
    console.log(error)
    req.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤'
    })
  }
}
