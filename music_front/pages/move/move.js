// pages/move/move.js
import request from '../../utils/request';
import config from '../../utils/config';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vidiolist: [], //导航标签数据
    active: 0,
    video: [],
    videolistid:'',//导航栏分类视频id
    videourls:'',//视频路径数组
    curvideoid:'',//当前点击视频id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getvideolist();//获取视频分类列表
    if(wx.getStorageSync('username')){//判断登陆时才可获取视频数据
      this.getvideo();//获取视频数据
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if(wx.getStorageSync('username')){//判断登陆时才可获取视频数据
      this.getvideo();//获取视频数据
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.setData({
      video:'',
      videourls:'',
    })
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
  //展示mv
  showMv() {
    wx.request({
      url: '/mv/first',
      method: 'GET',
      success(res) {
        // console.log(res);
      }
    })
  },

  //获取导航标签数据
  async getvideolist() {
    let videodata = await request.request(`/video/group/list`);
    this.setData({
      vidiolist: videodata.data.data.slice(0, 14),
    })
    this.setData({//初始化视频id为视频列表第一个
      videolistid:this.data.vidiolist[0].id,
    })
  },

  //获取列表id
  getid(e) {
    let navindex = e.detail.index;
    let navid = this.data.vidiolist[navindex].id;
    // console.log(navid);
    this.setData({
      videolistid:navid,
    })
    this.getvideo();//获取分类视频
  },

  // 获取列表视频数据(需要登陆)
  async getvideo() {
    let videourls=[]//视频路径数组
    let videolist = await request.request(`/video/group`, {
      id: this.data.videolistid,
    }, 'GET', 1); //需要登陆验证，请求头带cookie传入
    this.setData({
      video: videolist.data.datas,
    })
    //获取视频url
    for (let i = 0; i < this.data.video.length; i++) {
      let videosurl = await request.request('/video/url', {id:this.data.video[i].data.vid});
      videourls.push(videosurl.data.urls[0].url);
    }
    this.setData({
      videourls,
    })

  },

  //处理视频播放
  handleplay(e){
    let videoid = e.currentTarget.id;
    this.setData({
      curvideoid:videoid,
    })  
  }
})