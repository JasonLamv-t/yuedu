// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'yuedu-v2' })
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection(event.collection).doc(event.id).update({
    data: {
      reply: _.push({
        index: event.index,
        username1: event.username1,
        username2: event.username2,
        detail: event.detail
      })
    }
  })
}