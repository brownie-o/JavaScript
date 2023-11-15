// 沒有from 單純執行
import 'dotenv/config'
// 有from 執行並拉進來
import linebot from 'linebot'
import fe from './commands/fe.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// bot.on('message') => 代表收到訊息時
// https://www.npmjs.com/package/linebot
bot.on('message', event => {
  console.log(event)
  if (event.message.type === 'text') {
    if (event.message.text === '前端') {
      fe(event)
    }
  }
})

// '/' -> 路徑
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
