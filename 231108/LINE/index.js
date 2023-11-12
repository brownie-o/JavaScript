// 引用環境變數 只要執行檔案 沒有要從中取變數 => 把.env檔內的東西綁入env環境設定檔
import 'dotenv/config'
// 引用line機器人
import linebot from 'linebot'

// 建立機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', (event) => {
  console.log(event)
  if (event.message.type === 'text') {
    event.reply(event.message.text)
  }
})

// 監聽傳入localhost:3000或localhost:PORT的請求
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
