// pages/recommendsong/recommendsong.js
import Pubsub from 'pubsub-js';
import config from '../../utils/config'
import tool from '../../utils/tool'
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: '',
    day: '',
    songindex: 0,
    songs: [],
    thissong: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.getDate();
    if(wx.getStorageSync('username')){//判断登陆时才可获取每日推荐
         this.getsongs();//获取每日推荐
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
  //获取当前日期
  getDate() {
    this.setData({
      month: tool.formatNumber(new Date().getMonth() + 1) ,
      day:  tool.formatNumber(new Date().getDate()),
    })
  },

  //获取推荐歌曲
  async getsongs() {
    let that = this;
    let dailysong = await request.request(`/recommend/songs`,{},'GET',1);
    this.setData({
      songs:dailysong.data.data.dailySongs,
    })
  },
  
  //跳转到歌曲详情页面
  tosongdetail(e) {
    let songid = e.currentTarget.dataset.songid;
    if(songid){
      wx.navigateTo({
        url: `/pages/singdetail/singdetail?songid=${songid}&&songs=${encodeURIComponent(JSON.stringify(this.data.songs))}`,
      })
    }else{
      wx.navigateTo({
        url: `/pages/singdetail/singdetail?songs=${encodeURIComponent(JSON.stringify(this.data.songs))}`,
      })
    }
  }
})