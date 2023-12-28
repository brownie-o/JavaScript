import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import routerUsers from './routes/users.js'
import './passport/passport.js' // 註冊驗證方式

const app = express()

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

app.use('/users', routerUsers)

app.listen(4000, async () => {
  console.log('伺服器啟動')
  // 也可以寫進來
  await mongoose.connect(process.env.DB_URL)
  console.log('資料庫連線成功')
})
