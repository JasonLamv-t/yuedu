

Page({
  data: {
    item: {
      title: "白云山看山",
      date: "2020-08-08",
      address: "广东省广州市白云区"
    }
  },

  onLoad: function (options) {
    console.log("传过来的数据是")
    console.log(options.id)
    var id = options.id
    var that = this;
    const db = wx.cloud.database()
    db.collection('advice').where({
      _id: id
    }).get({
      success: function (res) {
        console.log(res.data)
        that.setData({
          item: res.data[0]
        })
      }
    })
  }





})
