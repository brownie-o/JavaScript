import 'dotenv/config' // 自動讀取.env檔
import express1 from 'express'
import mongoose from 'mongoose'
import users from './users.js'
import { StatusCodes } from 'http-status-codes' // 增加http status code可讀性
import validator from 'validator'
import cors from 'cors' // 可以跨域請求

// 連線資料庫
mongoose.connect(process.env.DB_URL)

// 建立express的網頁伺服器
const app = express1()

// 將傳入express伺服器請求的body (只有post, put, patch會有body) 解析為json格式 (會套用在所有請求上)
app.use(express1.json())
// 處理轉json的錯誤，有錯才會進到這裡
// 處理 middleware 的錯誤function 一定要填四個參數: (error, req, res, next)
// error: 錯誤的訊息
// next(): 繼續下一步
app.use((_, req, res, next) => {
  // .status(狀態碼)
  // https://zh.wikipedia.org/zh-tw/HTTP%E7%8A%B6%E6%80%81%E7%A0%81
  // https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '格式錯誤'
  })
})

// app.請求方式(路徑, 處理請求的function(請求資訊, 回傳資訊){})
app.post('/', async (req, res) => {
  console.log(req.body)
  try {
    // const user = await users.create(req.body)
    const user = await users.create({
      account: req.body.account,
      email: req.body.email
    })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: user
    })
  } catch (error) {
    console.log(error)
    // 資料重複的錯誤
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
})

// get請求
app.get('/', async (req, res) => {
  try {
    const result = await users.find()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
})

// 查詢
// /:id 會把網址/後面的東西變成叫做id的變數
app.get('/:id', async (req, res) => {
  // 取出網址的id
  // params = 參數 => 網址後面的字(這邊是id)
  console.log(req.params.id)
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID_INVALID')
    // 三種查詢法
    // const user = await users.find({ _id: req.params.id }) // 查所有的，回傳結果是陣列
    // const user = await users.findOne({ _id: req.params.id }) // 找一個
    const user = await users.findById(req.params.id) // 找符合ID的

    // 發生錯誤往下跳到catch
    if (!user) throw new Error('NOT_FOUND')

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: user
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID_INVALID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.message === 'NOT_FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無資料'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
})

app.patch('/:id', async (req, res) => {
  // 邊查詢邊更新
  try {
    // 操作前先把不合規定的id擋下來
    if (!validator.isMongoId(req.params.id)) throw new Error('ID_INVALID')

    // .findByIdAndUpdate()
    // { new: true/false } 回傳更新前or 更新後的資料，預設是false(更新前的資料)
    // new: true => 回傳更新後的資料
    // runValidators: true => 執行 schema定義的驗證
    const user = await users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    // 操作前把不合規定的user name擋下來
    if (!user) throw new Error('NOT_FOUND')

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: user
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID_INVALID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號或信箱重複'
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message

      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error.message === 'NOT_FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無資料'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
})

app.delete('/:id', async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID_INVALID')

    const user = await users.findByIdAndDelete(req.params.id)

    if (!user) throw new Error('NOT_FOUND')

    // 被刪掉的資料
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'CastError' || error.message === 'ID_INVALID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.message === 'NOT_FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無資料'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
})

// 綁定4000的port
app.listen(4000, () => {
  console.log('伺服器啟動')
})
