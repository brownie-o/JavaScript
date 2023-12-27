import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express' // 網頁伺服器
import { StatusCodes } from 'http-status-codes'
import routeProducts from './routes/products.js'
import routeUsers from './routes/users.js'

mongoose.connect(process.env.DB_URL)

const app = express()

app.use(express.json())

/*
  1. _ : 表示忽略第一個參數。這是因為在這種情況下，通常不關心客戶端的錯誤，所以使用底線表示我們忽略這個參數。

  2. req：表示 HTTP 請求物件，包含了客戶端發送的所有請求資訊。

  3. res：表示 HTTP 響應物件，用於發送響應給客戶端。

  4. next：是一個回呼函式，用於將控制權交給中間件鏈中的下一個中間件。如果不調用 next()，則中間件鏈將停止執行，並結束當前的請求-響應週期。
*/

// 手動處理錯誤
app.use((_, req, res, next) => {
  // 格式不符
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({
      success: false,
      message: '資料格式錯誤'
    })
})

// 所有進到products的路由都交給routeProducts處理
app.use('/products', routeProducts)

// 使用者的路由都交給 routeUsers處理
app.use('/users', routeUsers)

// 啟動網頁伺服器，並使其在 4000 號埠上監聽。
app.listen(4000, () => {
  console.log('網頁伺服器啟動')
})
