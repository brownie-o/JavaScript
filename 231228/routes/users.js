import { Router } from 'express'
import { create, login, profile, logout, avatar } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.post('/', create)
// ('/login', auth.login, login) 路徑後有兩個東西=> 進到第一個後進第二個
// auth.login => from auth.js 先進到middleware的驗證
// 再到controller的login
router.post('/login', auth.login, login)
// auth.jwt 會先進到 auth.js 的jwt function
router.get('/profile', auth.jwt, profile)
// 若是成功登出mongodb的token會被清除
router.delete('/logout', auth.jwt, logout)
// 先驗證 再處理圖片上傳 (上傳用patch)
router.patch('/avatar', auth.jwt, upload, avatar)

export default router
