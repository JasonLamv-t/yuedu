
Page({
  data: {
    title: '',
    region: ['北京市', '海淀区', '中央民族大学'],
    date: "2020-06-08",
    address: "一个神秘的地方"
  },

  title: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  date: function (e) {
    console.log(e)
    this.setData({
      date: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('携带值为', e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    this.setData({
      region: e.detail.value,
      address: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    })
  },
  add: function (e) {
    var that = this;
    const db = wx.cloud.database()

    db.collection('advice').add({
      data: {
        title: that.data.title,
        date: that.data.date,
        address: that.data.address
      },
      success: function (res) {
        console.log(res)
      }
    })

    wx.navigateTo({
      url: '../advice/advice',
    })
  }


})
