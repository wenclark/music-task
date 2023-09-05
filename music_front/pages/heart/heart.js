// pages/heart/heart.js
import request from '../../utils/request';
import Pubsub from 'pubsub-js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    heart: [],
    imgurl: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image", //云图片路径
    iscollect: true,
    thissong:'',
    songindex:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let username = options.username;
    this.setData({
      username,
    })
    this.getheartsong();
    //订阅singdetail页面传来的切换歌曲方式
    Pubsub.subscribe('switchname', (message, type) => {
      //上一首歌
      if (type === 'pre') {
        if (this.data.songindex === 0) {
          this.setData({
            songindex: this.data.heart.length - 1,
          })
        } else {
          this.setData({
            songindex: this.data.songindex - 1,
          })
        }
      }
      //下一首歌
      if (type === 'next') {
        if (this.data.songindex === this.data.heart.length - 1) {
          this.setData({
            songindex: 0,
          })
        } else {
          this.setData({
            songindex: this.data.songindex + 1,
          })
        }
      }
      this.setData({
        thissong: this.data.heart[this.data.songindex],
      })
      Pubsub.publish('currentid', this.data.thissong.songid);
    })
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

  //返回上一个页面
  backpage() {
    wx.navigateBack({
      delta: 1,
    })
  },

  //获取心动歌曲
  async getheartsong() {
    let collection = await request.request2('/getcollect', {
      username: wx.getStorageSync('username'),
    }, 'POST');
    this.setData({
      heart: collection.data.data,
    })
  },

  //跳转到播放页面
  toheartsong(e) {
    let {
      songid,
      songindex
    } = e.currentTarget.dataset;
    this.setData({
      songindex: songindex,
    })
    wx.navigateTo({
      url: `/pages/heartsong/heartsong?songid=${songid}`,
    })
  },
})