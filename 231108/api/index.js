import axios from 'axios'
// fs = file system (node.js 內建套件 不須另外安裝)
import fs from 'node:fs'

const main = async () => {
  try {
    const { data } = await axios.get('https://odws.hccg.gov.tw/001/Upload/25/opendataback/9059/1550/245aa5d2-c5b5-4e7d-afbf-420248f63e2c.json')
    console.log(data.length)
    // 寫入檔案 (變出一個檔案，檔名 = 下面的檔案路徑 (food.json))
    // fs.writeFileSync('檔案路徑', 文字) => 把文字寫進檔案裡
    // JSON.stringify(data, 取代(null), 縮排(2 = 用兩個空白縮排))
    fs.writeFileSync('./food.json', JSON.stringify(data, null, 2))
  } catch (error) {
    console.log('錯誤')
  }
}

main()
