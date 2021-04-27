// pages/article/article.js
const app = getApp()
const cloud = wx.cloud
const db = cloud.database()
const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // tabs设置
    tabs: [],
    activeTab: 0,
    swiperHeight: '', // 窗口高度
    isShow: false,

    // 文章列表
    recommend: [],
    humanities: [],
    culture: [],
    tech: [],

    testimg: 'https://leicloud.ulearning.cn//tongsk/contentmanage/85bcde8d-b5ba-4e72-9db3-b18d9924af4d.JPG?imageslim|imageView2/1/w/320/h/180'
  },

  onTabCLick(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index
    })
    // console.log(e)
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index
    })
    // console.log(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { wx.showLoading({
    title: '加载中',
  })
  // 获取文章信息并分类存入文章列表
  db.collection('article').get().then(articles => {
    let list0 = [], list1 = [], list2 = [], list3 = []
    for (let item of articles.data) {
      if (item.tag.indexOf("人与社会") != -1) list0.push(item)
      if (item.tag.indexOf("人与环境") != -1) list1.push(item)
      if (item.tag.indexOf("人与文化") != -1) list2.push(item)
      if (item.tag.indexOf("人与科技") != -1) list3.push(item)
      console.log()
    }
    this.setData({
      recommend: list0,
      humanities: list1,
      culture: list2,
      tech: list3
    })
    wx.hideLoading()
  })

  // 设置页面高度
  // console.log(app.globalData)
  this.setData({
    swiperHeight: app.globalData.windowHeight - app.globalData.homeBarHeight - 36
  })

  // 设置首页tabs
  const titles = ['人与社会', '人与环境', '人与文化', '人与科技']
  const tabs = titles.map(item => ({
    title: item
  }))
  this.setData({ tabs })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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