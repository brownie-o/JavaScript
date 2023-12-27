// import mongoose from 'mongoose'

// const schema = new mongoose.schema({}) =
import { Schema, model } from 'mongoose'

const schema = new Schema({
  // 商品名欄位
  name: {
    type: String,
    required: [true, '缺少商品名稱']
  },
  // 商品價格欄位
  price: {
    type: Number,
    required: [true, '缺少商品價格'],
    min: [0, '商品價格不能小於0']
  },
  category: {
    type: String,
    // enum: 限制此欄位的值只能是value的其中之一
    enum: {
      values: ['遊戲', '衣服', '手機'],
      // {VALUE} 會被自動替換為傳入的值
      message: '查無 {VALUE} 分類'
    }
  }
})

// 變成可以操作的model
// 設定資料collection 的名字為 products (要使用複數)
export default model('products', schema)
