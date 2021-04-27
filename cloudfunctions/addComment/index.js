// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'yuedu-v2'})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection(event.collection).doc(event.id).update({
    data: {
      comment: _.push({
        name: event.name,
        detail: event.detail,
        score: event.score,
        reply: []
      })
    }
  })
}