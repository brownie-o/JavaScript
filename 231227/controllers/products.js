import products from '../models/products.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

// 寫新增商品的function
export const create = async (req, res) => {
  try {
    // model的create語法
    const result = await products.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
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
}

export const getId = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID INVALID')

    // const result = await products.findOne({ _id: req.params.id }) =

    const result = await products.findById(req.params.id)
    // 如果沒找到就回傳這個error
    if (!result) throw new Error('NOT FOUND')

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID INVALID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
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
}

export const getAll = async (req, res) => {
  try {
    // 1. 分類名稱為手機
    // 2. 價格大於等於 20000 以上 ($gte)
    // 3. 名字必須完全符合A，或是符合正則表達式: 不分大小寫的Phone
    // const result = await products.find({
    //   category: '手機',
    //   // $gte => .find() 語法的大於等於的意思
    //   price: { $gte: 20000 },
    //   name: {
    //     // $in: [/Phone/i]
    //     $in: ['A', /Phone/i]
    //   }
    // })

    // .sort({ 欄位: 1 正序(便宜到貴)/ -1 倒序(貴到便宜) })
    // .limit(限制筆數)
    // .skip(跳過筆數)
    // const result = await products.find().sort({ price: 1 }).limit(2).skip(2)

    // req.query = 網址參數
    // .sort => 排序順序
    console.log(req.query) // { sortBy: 'price', sort: '1' }
    const result = await products.find().sort({ [req.query.sortBy || '_id']: req.query.sort * 1 || 1 })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}
