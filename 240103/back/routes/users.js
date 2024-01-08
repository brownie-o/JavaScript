import { Router } from 'express'
import { create, login, logout, extend, getProfile } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'

const router = Router()
router.post('/', create)
router.post('/login', auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend) // 舊換新
router.get('/me', auth.jwt, getProfile) // 取自己的資料

export default router