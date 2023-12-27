import { Router } from 'express'
import { create, addCart, getId } from '../controllers/users.js'

const router = new Router()

// '/' = '/users' (相對於index.js的路徑)
router.post('/', create)
// 客人綁定自己的購物車
router.post('/:id/cart', addCart)
router.get('/:id', getId)

export default router
