import 'dotenv/config' // 自動讀取.env檔
import express1 from 'express'
import mongoose from 'mongoose'
import users from './users.js'

// 連線資料庫
mongoose.connect(process.env.DB_URL)

// 建立express的網頁伺服器
const app = express1()

// 將傳入express伺服器請求的body (只有post, put, patch會有body) 解析為json格式 (會套用在所有請求上)
app.use(express1.json())

// app.請求方式(路徑, 處理function(請求資訊, 回傳資訊){})
app.post('/', async (req, res) => {
  try {
    const user = await users.create({
      account: req.body.account,
      email: req.body.email
    })

    res.status(200).json({
      success: true,
      message: '',
      result: user
    })
  } catch (error) {
    console.log(error)
  }
})

// 綁定4000的port
app.listen(4000, () => {
  console.log('伺服器啟動')
})
