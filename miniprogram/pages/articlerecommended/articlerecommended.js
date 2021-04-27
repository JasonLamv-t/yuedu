Page({
  data: {
    title: "",
    article: "",
    word: "",
    img: "",
    tag: "",
    items: [{ name: '0', value: '人与社会' }, { name: '1', value: '人与环境', checked: 'true' }, { name: '2', value: '人与文化' }, { name: '3', value: '人与科技' },],
    error: '',
    wordType: [{ type: '负面', value: -1 }, { type: '中性', value: 0 }, { type: '正面', value: 1 }],
    keywords: [],
  },

  // 修改词性
  typeChange: function (e) {
    console.log(e)
    this.setData({
      ['keywords[' + e.target.dataset.index + '].positive']: parseInt(e.detail.value)
    })
  },

  // 修改关键词
  typingWord: function (e) {
    this.setData({
      ['keywords[' + e.currentTarget.dataset.index + '].word']: e.detail.value
    })
  },

  // 添加关键词
  add: function (e) {
    this.data.keywords.push({ word: '', positive: 0 })
    this.setData({ keywords: this.data.keywords })
  },

  // 移除关键词
  remove: function (e) {
    console.log(e)
    this.data.keywords.splice(e.target.dataset.index, 1)
    this.setData({ keywords: this.data.keywords })
  },

  // 获取关键词
  getKeyword: function (e) {
    if (this.data.article.length <= 30) {
      this.setData({ error: '文章长度太短' })
      return
    }
    wx.cloud.callFunction({
      name: 'getKeyword',
      data: {
        Text: this.data.article
      }
    }).then(res => {
      console.log(res)
      this.setData({
        keywords: JSON.parse(res.result).Keywords.map(item => {
          return {
            word: item.Word,
            positive: 0
          }
        })
      })
    })
  },

  title: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value //待插入的文章title字段
    })
  },

  article: function (e) {
    console.log(e.detail.value)
    this.setData({
      article: e.detail.value //待插入的文章article字段
    })
  },

  word: function (e) {
    console.log(e.detail.value)
    this.setData({
      word: e.detail.value //待插入的文章word字段
    })
  },

  radioChange: function (e) {
    this.setData({
      tag: this.data.items[e.detail.value].value //待插入的文章tag字段
    })
  },

  picfunction: function () {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        var timestamp = (new Date()).valueOf();
        wx.cloud.uploadFile({
          cloudPath: "img/" + timestamp + ".jpg", // 上传至云端的路径
          filePath: filePath, // 小程序临时文件路径
          success: res => {
            console.log('[上传文件] 成功：', res)
            that.setData({
              img: res.fileID //待插入的文章img字段
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  submit: function (e) {
    if (this.data.title == '') {
      this.setData({
        error: '请先选择文章标题'
      })
      return
    }
    if (this.data.article == '') {
      this.setData({
        error: '请先选择文章内容'
      })
      return
    }
    if (this.data.tag == '') {
      this.setData({
        error: '请先选择文章类型'
      })
      return
    }
    if (this.data.img == '') {
      this.setData({
        error: '请先上传图片'
      })
      return
    }
    const db = wx.cloud.database()
    db.collection('article').add({ //插入新闻信息
      data: {
        title: this.data.title,
        article: this.data.article,
        keywords: this.data.keywords,
        word: this.data.word,
        img: this.data.img,
        comment: [],
        reply: [],
        tag: [this.data.tag]
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log("插入成功" + res)
        wx.showToast({
          title: '添加成功',
        })
        setTimeout(wx.navigateBack({}), 1000)
      },
      fail: console.error
    })
  }


})