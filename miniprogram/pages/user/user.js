const app = getApp()
const gb = app.globalData
const db = wx.cloud.database()
const wxp = gb.wxp

Page({
  data: {
    authTapCount: 0
  },

  onLoad: function () {
    wxp.getUserInfo().then(r => {
      this.setData({
        userInfo: r.userInfo,
        myAuth: gb.userData.auth
      })
    }).catch(e => {
      wx.redirectTo({ url: './unlogined.wxml' })
    })
  },

  // 认证身份互相转换
  auth: function (e) {
    if (this.data.authTapCount != 5) {
      this.data.authTapCount++
      return
    }
    this.data.authTapCount = 0
    let newAuth = app.globalData.userData.auth == 'teacher' ? 'student' : 'teacher'
    db.collection('userData').where({}).update({
      data: {
        auth: newAuth
      }
    }).then(res => {
      this.setData({ myAuth: newAuth })
      app.globalData.userData.auth = newAuth
      wx.showToast({ title: newAuth == 'teacher' ? '修改授权为老师' : '修改授权为学生' })
    }).catch(e => { console.error(e) })
  },

  // 文章推荐
  mefuntion: function (e) {
    wx.navigateTo({
      url: '../articlerecommended/articlerecommended',
    })
  },

  // 我的建议
  setup: function () {
    wx.navigateTo({
      url: '../advice/advice',
    })
  }
})