// import 自訂變數(a) from 檔案或套件
// 檔案寫相對陸定必須是 ./ 或 ../ 開頭
// './a.js' => 檔案; 'a.js' => npm套件
// import from 只能寫在最上面
import a from './a.js'

// 一次引用所有匯出
// import * as 自訂變數(b) from 檔案或套件
import * as b from './b.js'
// 個別引用，變數名稱需和來源檔案一樣
// import {變數1, 變數2, 變數3 as 自訂名稱} from 檔案或套件
// 若有同名變數可以用 OOO as XXX
import { b1, b2, test as btest } from './b.js'

// 同時引用預設和具名匯出
import c, * as cc from './c.js'
// import c, {arr1} from './c.js'

// 取得目前node.js執行檔的資料夾和檔案名稱:

// CommomJS語法: __dirname & __filename 
// console.log(`資料夾路徑: ${__dirname}`)
// console.log(`檔案名稱: ${__filename}`)

// ECMAScript 語法
console.log('import.meta.url: ' + import.meta.url)

// default 匯出時直接修改值不會改到原檔案的變數
console.log('a', a)
console.log('a.test2', a.test2())   // 1
a.a1 = 500
console.log('a.a1', a.a1)         // 500
console.log('a.test2', a.test2())   // 1

console.log('a.test3', a.test3()) // 3
a.a3 = 500
console.log('a.a3', a.a3)         // 500
console.log('a.test3', a.test3()) // 3

// 需要呼叫function修改
a.test() // a3+100=103
console.log('a.a3', a.a3)         // 500
console.log('a.test3', a.test3()) // 103


console.log('=========================')

/*
console.log('b.b1', b.b1)         // 1
// 具名匯入的東西唯獨，不能修改
// TypeError: Cannot assign to read only property 'b1' of object '[object Module]'
// b.b1 = 100

console.log('b.b2', b.b2)         // 2
// TypeError: Cannot assign to read only property 'b2' of object '[object Module]'
// b.b2 = 100

b.test()
console.log('b.b2', b.b2)          // 102
*/

// 切換成個別引用的匯入
// 不管來源是let or const 都不能修改
console.log(b1)                   // 1
// TypeError: Assignment to constant variable.
// b1 = 100

console.log(b2)                  // 2
// TypeError: Assignment to constant variable.
// b2 = 100

// 但可以呼叫function改值
btest()
console.log(b2)                  // 102

console.log('=========================')

// 不管具名或預設
// 如果引用的資料型態是物件或陣列
// 修改時會一起改道原本檔案的值 (PASS BY REFERENCE)
console.log(c.arr2)        // [ 'a', 'b', 'c', 'd' ]
c.arr2.push('e')
console.log(c.arr2)        // [ 'a', 'b', 'c', 'd', 'e' ]
console.log(c.test())      // [ 'a', 'b', 'c', 'd', 'e' ]

console.log(cc.arr1)       // [ 1, 2, 3, 4 ]
cc.arr1.push(5)
cc.arr1[0] = 3
console.log(cc.arr1)       // [ 3, 2, 3, 4, 5 ]

// TERMINAL npm
// npm init --yes
// npm i ____ = npm install _(套件名)_ 
// npm i -D nodemon eslint
// npm i -D ____
// -D only adds the package to your “dev dependencies,” which means they'll only be installed when developing the project, and not when building the finalized production version of the project.
// npm un ____ ____ ____ (uninstall 套件)
// npm i -g ______ (-g = 全域安裝)

// install: 
// 1. npm i -D eslint nodemon
// eslint: 強制程式風格的套件
// nodemon: 偵測到變更就會重整的套件

// 2. npm i linebot axios dotenv
// dotenv: 讀取env檔案的套件

// 安裝 .eslintrc.json
// 如果被包在資料夾裡面就無法用 F1 => Eslint:Create
// 自己打: npx eslint --init (初始化設定)
//  check syntax, style
//  JS import(esm
//  None of these
//  node
//  popular guide
//  standard
//  Json
//  Yes
//  npm (套件管理員)
// ctrl+c =取消 重來
// 重新安裝node modules -> npm i

// package.json => 
// "scripts": {
//  "predev": "node a.js",
//  "dev": "node index.js",
//  "postdev": "node b.js"
// }

// 開啟機器人
// npm run dev

// 開啟3000的PORT, set to public
// update Webhook url(line bot) to forwarded address

// 排程套件 https://www.npmjs.com/package/node-schedule
// npm i node-schedule