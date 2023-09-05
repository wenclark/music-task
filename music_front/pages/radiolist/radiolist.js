// pages/radiolist/radiolist.js
import Pubsub from 'pubsub-js';
import config from '../../utils/config'
import tool from '../../utils/tool'
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioid:"",
    videos:[],
    songindex: 0,
    thissong: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
 async onLoad(options) {
    this.data.radioid = options.radioid;
    this.getvideos();
    
  },
  getvideos()
  {
    let that = this;
    wx.request({
     url: `${config.host}/dj/program?rid=${this.data.radioid}&asc=true`,
     method: 'GET',
     header:{
       cookie:wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_A=bf8bfeabb')!=-1)
       ,
     },
     success(res) {
        that.setData({
          videos:res,
        })
        console.log(that.data.videos.data.programs[0].id);
     }
   })
  },
   //跳转到电台单曲详情页面
  async  toradiodetail(e) {
  let index=e.currentTarget.dataset.index;
  wx.navigateTo({
     url: `/pages/radiodetail/radiodetail?songid=${this.data.videos.data.programs[index].mainSong.id}&radioname=${this.data.videos.data.programs[index].name}&radiotime=${this.data.videos.data.programs[index].mainSong.bMusic.playTime}&radioid=${this.data.videos.data.programs[index].id}`,
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

  }
})