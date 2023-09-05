// pages/person/person.js
import config from '../../utils/config';
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image", //云图片路径
    avator: "../../static/image/sing.png", //用户头像
    hid: true,
    regist_hid: true,
    login_hid: false,
    user: "登录",
    username: "",
    password: "",
    statY: 0,
    moveY: 0,
    moveDistance: 0,
    transformY: '',
    transtyle: 'transform 0.2 linear',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.getavator();//获取用户头像
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  //设置用户头像
  setAavator() {
    let that = this;
    wx.chooseMedia({ //选取本地图片
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(chooseres) {
        wx.showLoading({
          title: '正在上传头像',
        })
        let timestamp = (new Date()).valueOf(); //获取时间戳作为云存储内头像名
        wx.cloud.init(); //初始化云函数
        wx.cloud.uploadFile({ //图片上传到云端
          // 指定上传到的云路径
          cloudPath: "avator/" + timestamp + '.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseres.tempFiles[0].tempFilePath,
          success(cloudres) {
            wx.hideLoading();
            wx.showToast({
              title: '头像上传完成',
            })
            if (cloudres.fileID) { //获取到路径非空
              let avatorurl = cloudres.fileID;
              let setAvatorres = request.request2('/app/selavator', {
                username: wx.getStorageSync('username'),
                pic: avatorurl,
              }, 'POST');
              that.getavator();
            }
          }
        })
      }
    })
  },

  //获取用户头像
  async getavator() {
    let avator = await request.request2('/app/getavator', {
      username: wx.getStorageSync('username'),
    }, 'POST');
    if (avator.data.data[0].pic) {
      this.setData({
        avator: avator.data.data[0].pic,
      })
    }
  },

  //显示登录注册框
  showUserbox() {
    this.setData({
      hid: false,
      username: "",
      password: "",
    })
  },
  //显示注册框
  showRegist() {
    this.setData({
      login_hid: true,
      regist_hid: false,
      username: "",
      password: "",
    })
  },
  //显示登录框
  showLogin() {
    this.setData({
      regist_hid: true,
      login_hid: false,
    })
  },
  //关闭登陆注册框
  closelogin() {
    this.setData({
      hid: true,
      regist_hid: true,
      login_hid: false,
    })
  },
  //获取用户名
  getUser(e) {
    this.setData({
      username: e.detail.value,
    })
  },
  //获取密码
  getpsw(e) {
    this.setData({
      password: e.detail.value,
    })
  },
  //登录账号
  Login() {
    let that = this;
    wx.request({
      url: 'http://127.0.0.1:8081/app/login',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        username: this.data.username,
        password: this.data.password,
      },
      success(res) {
        let historysong = [];
        if (res.data.status == 200) {
          wx.showToast({
              title: '登陆成功',
            }),
            //游客访问网易云登录api
            wx.request({
              url: `${config.host}/register/anonimous`,
              method: 'GET',
              success(re) {
                wx.setStorageSync('cookies', re.data.cookie.split(';')); //存入cookie
                wx.setStorageSync('username', that.data.username); //存入用户名
                wx.setStorageSync('historysong', historysong);//存入历史听歌记录
                that.getavator();
              },
              complete() {
                that.setData({
                  hid: true,
                  user: that.data.username,
                })
              }
            })
        }
        else{
          wx.showToast({
            title:res.data.message ,
            icon:'none',
          })
        }
      },
    })
  },
  //注册账号
  Regist() {
    wx.request({
      url: 'http://127.0.0.1:8081/app/regist',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        username: this.data.username,
        password: this.data.password,
      },
      success(res) {
        if (res.data.status == 200) {
          wx.showToast({
            title: '注册成功',
          })
        }
        else{
          wx.showToast({
            title: res.data.message,
            icon:'none',
          })
        }
      }
    })
  },
  //退出登录
  exit() {
    wx.showModal({
      title: '提示',
      content: '是否确认退出',
      complete: async (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          let exitmsg = await request.request('/logout');
          wx.removeStorageSync('cookies');
          wx.removeStorageSync('username');
          wx.removeStorageSync('historysong');
          wx.showToast({
            title: '成功退出',
          })
          this.setData({
            avator: "../../static/image/sing.png", //退出恢复默认头像
            user: "登录", //恢复默认用户名
          })
        }
      }
    })
  },
  //心动歌曲
  heartsong() {
    wx.navigateTo({
      url: `/pages/heart/heart?username=${wx.getStorageSync('username')}`,
    })
  },
  //查看历史听歌
  showhistory(){
    wx.navigateTo({
      url: "/pages/history/history",
    })
  },
  touchStart(e) {
    this.setData({
      transtyle: '',
      statY: e.touches[0].clientY
    })
  },
  touchMove(e) {
    let moveDistance = this.data.moveY - this.data.statY;
    moveDistance = moveDistance > 100 ? 100 : moveDistance;
    moveDistance = moveDistance < 0 ? 0 : moveDistance;
    this.setData({
      moveY: e.touches[0].clientY,
      moveDistance: moveDistance,
      transformY: `translateY(${this.data.moveDistance}rpx)`,
    })
  },
  touchEnd(e) {
    this.setData({
      transformY: "translateY 0rpx",
      transtyle: "transform 1s linear",
    })
  },

})