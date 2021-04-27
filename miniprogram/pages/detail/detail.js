// pages/article/detail.js
const db = wx.cloud.database()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    type: '',

    // 文章信息
    title: '',
    article: '',
    img: '',
    comments: [],
    keywords: '',
    word: '',
    video: '',

    // 是否点赞和收藏
    isLike: false,
    isStar: false,

    myAuth: '',

    // 输入的评论
    myComment: '',

    // 评论或回复的目标
    username: '',
    index: '',

    // 错误提示
    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // options.id = "b7ef76b45ea7c63d005f0bcf02232d321"
    // 读取文章信息
    db.collection(options.type).doc(options.id)
      .get().then(res => {
        console.log(res)
        res = res.data
        let comment = res.comment
        for (let index = 0; index < comment.length; index++) {
          res.reply.map(reply => {
            if (reply.index == index) comment[index].reply.push(reply)
          })
        }
        this.setData({
          id: options.id,
          type: options.type,
          title: res.title,
          article: res.article,
          img: res.img,
          word: res.word,
          keywords: res.keywords,
          comments: comment,
          video: res.video == undefined ? '' : res.video
        })
      })
    // 根据文章id和用户数据判读收藏和点赞的情况
    this.setData({
      isLike: app.globalData.userData.like.indexOf(options.id) == -1 ? false : true,
      isStar: app.globalData.userData.star.indexOf(options.id) == -1 ? false : true
    })
  },

  // 设置评论或者回复的目标
  setReply: function (e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      username: e.currentTarget.dataset.user,
      index: e.currentTarget.dataset.index,
    })
  },

  // 输入框失焦
  blur: function (e) {
    setTimeout(() => { this.setData({ username: '' }) }, 300)
  },

  // 点赞
  like: function () {
    // 如果已经点赞，则删除
    if (this.data.isLike) {
      app.globalData.userData.like.splice(app.globalData.userData.like.indexOf(this.data.id), 1)
    }
    else {
      app.globalData.userData.like.push(this.data.id)
    }
    this.setData({ isLike: !this.data.isLike })
    // console.log(app.globalData.userData)
  },

  // 收藏
  star: function () {
    if (this.data.isStar) {
      app.globalData.userData.star.splice(app.globalData.userData.star.indexOf(this.data.id), 1)
    }
    else {
      app.globalData.userData.star.push(this.data.id)
    }
    this.setData({ isStar: !this.data.isStar })
  },

  // 发送评论
  sendComment: function (event) {
    if (this.data.myComment.length < 4) {
      this.setData({ error: '评论字数不能少于4个字符' })
      return
    }

    // 这里使用字符串分割的方法来对关键词进行统计
    let Pcount = 0, Ncount = 0, Zcount = 0
    this.data.keywords.map(item => {
      if (item.positive > 0) Pcount += this.data.myComment.split(item.word).length - 1
      else if (item.positive < 0) Ncount += this.data.myComment.split(item.word).length - 1
      else Zcount += this.data.myComment.split(item.word).length - 1
    })
    console.log(Pcount, Ncount, Zcount)
    let positive = Pcount + Ncount + Zcount
    positive = positive ? positive : 1
    positive = Pcount / positive > 0.5 ? 1 : (Ncount / positive > 0.5 ? -1 : 0)
    console.log(positive)

    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo.nickName == undefined) console.log('没有昵称')

    wx.cloud.callFunction({
      name: 'addComment',
      data: {
        name: app.globalData.userInfo.nickName,
        detail: this.data.myComment,
        collection: this.data.type,
        id: this.data.id,
        score: positive,
        reply: []
      }
    }).then(res => {
      // console.log(res)
      if (res.errMsg == "cloud.callFunction:ok" && res.result.errMsg == "document.update:ok") {
        db.collection(this.data.type).doc(this.data.id).get()
          .then(res => {
            res = res.data
            let comment = res.comment
            for (let index = 0; index < comment.length; index++) {
              res.reply.map(reply => {
                if (reply.index == index) comment[index].reply.push(reply)
              })
            }
            this.setData({
              comments: res.comment
            })
            this.setData({
              comments: res.comment
            })
          })
        wx.showToast({
          title: '评论成功',
        })
      }
    })
  },

  // 发送回复
  sendReply: function (event) {
    if (this.data.myComment.length < 4) {
      this.setData({ error: '评论字数不能少于4个字符' })
      return
    }

    this.data.comments[this.data.index].reply.push({
      username1: app.globalData.userInfo.nickName,
      username2: this.data.username,
      detail: this.data.myComment
    })

    wx.cloud.callFunction({
      name: 'addReply',
      data: {
        username1: app.globalData.userInfo.nickName,
        username2: this.data.username,
        detail: this.data.myComment,
        comment: this.data.comments[this.data.index],
        index: this.data.index,
        collection: this.data.type,
        id: this.data.id,
      }
    }).then(res => {
      console.log(res)
      if (res.errMsg == "cloud.callFunction:ok" && res.result.errMsg == "document.update:ok") {
        db.collection(this.data.type).doc(this.data.id).get()
          .then(res => {
            res = res.data
            let comment = res.comment
            for (let index = 0; index < comment.length; index++) {
              res.reply.map(reply => {
                if (reply.index == index) comment[index].reply.push(reply)
              })
            }
            this.setData({
              comments: res.comment
            })
          })
        wx.showToast({
          title: '评论成功',
        })
      }
    })
  },

  // 输入监听
  typing: function (event) {
    this.setData({ myComment: event.detail.value })
  },

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    // 页面隐藏时更新用户的收藏和点赞信息
    // db.collection('userData').where({}).get()
    // .then(res => {
    //   console.log(res)
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面隐藏时更新用户的收藏和点赞信息
    db.collection('userData').doc(app.globalData.userData.id).update({
      data: {
        like: app.globalData.userData.like,
        star: app.globalData.userData.star
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ myAuth: app.globalData.userData.auth })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})