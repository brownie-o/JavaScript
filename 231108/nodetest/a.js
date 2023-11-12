const a1 = 1
const a2 = 2
let a3 = 3
const test = () => {
  a3 += 100
}

const test2 = () => {
  return a1
}

const test3 = () => {
  return a3
}
// 預設匯出，一個檔案只能有一個，只能匯出一個東西
export default {
  a1, a2, a3, test, test2, test3
}