import { Router } from 'express'
import { create, getId, getAll } from '../controllers/products.js'

// 建立路由
const router = new Router()

// 最後路徑會是 /products (相對於index.js的路徑)
// 雖然是 '/' 但相對於 app.use 的路徑(index.js) 所以是 '/products'
router.post('/', create)
router.get('/:id', getId)
router.get('/', getAll)

export default router
