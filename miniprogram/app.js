//app.js
// promisify all wx's api
import { promisifyAll, promisify } from 'miniprogram-api-promise'
const wxp = {}
promisifyAll(wx, wxp)

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'yuedu-v2',
        traceUser: true,
      })
    }

    const db = wx.cloud.database()

    this.globalData = {
      wxp,
      isLogined: false, // 登录态
      setting: {
        isUseFinger: false,
      },

      safeArea: [], // 设备安全区域
      system: '', // 设备系统
      windowHeight: '', // 窗口高度
      statusBarHeight: '', // 状态栏高度
      homeBarHeight: '', // home区域高度

      // 用户数据
      userData: {
        star: [],   // 收藏
        like: [],   // 点赞
        id: '',
        auth: '',   // 认证
      },

      // 用户数据
      userInfo: ''
    }

    // 获取用户的收藏点赞信息
    db.collection('userData').get()
      .then(res => {
        // 如果有信息则读取保存到全局变量，如果没有则为他生成一条空白数据，减少后期判断
        if (res.data.length != 0) {
          this.globalData.userData.like = res.data[0].like
          this.globalData.userData.star = res.data[0].star
          this.globalData.userData.id = res.data[0]._id
          this.globalData.userData.auth = res.data[0].auth
        } else {
          db.collection('userData').add({
            data: {
              star: [],
              like: [],
              auth: 'student',
            }
          }).then(res => {
            this.globalData.userData.id = res._id
          })
        }
      })// 后面的异常不处理了，小项目，实际这个请求可能会有异常，需要分层捕获并进行处理

    // 获取用户信息
    wxp.getSetting().then(r => {
      if (r.authSetting['scope.userInfo']) return wxp.getUserInfo()
      else return false
    }).then(r => {
      if (r) this.globalData.userInfo = r.userInfo
      else wxp.reLaunch({ url: '/pages/user/unlogined' })
    }).catch(e => {
      console.error(e)
    })

    // 获取设备信息
    wx.getSystemInfo({
      complete: (res) => {
        // console.log(res)
        this.globalData.safeArea = res.safeArea
        this.globalData.system = res.system
        this.globalData.windowHeight = res.windowHeight
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.homeBarHeight = res.screenHeight - res.safeArea.bottom
      },
    })
  }
})
