// pages/classfsing/classfsing.js
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:0,//分类索引
    checkedsong:[],
    singlist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
 async onLoad(options) {
   let checkedsong=[];
 checkedsong =JSON.parse(options.checkedsong);
         this.setData
         ({
              checkedsong:checkedsong,
         })
   let singfo;
   singfo = await request.request(`/top/playlist?cat=${checkedsong[0]}`);
   this.setData({
     singlist:singfo.data.playlists,
   })
  //  console.log(this.data.singlist);
  },
  //获取点击导航的索引
 async select(e)
 {
   let index = e.currentTarget.dataset.index;
   this.setData({
    select:index,
   })
  // console.log(this.data. checkedsong[index]);
   this.getsing(index);
},
 async getsing(index)
 {
   let singdata= await request.request(`/top/playlist?cat=${this.data.checkedsong[index]}`);
   this.setData({ 
    singlist: singdata.data.playlists,
  })
   console.log(this.data.singlist);
 },
  //跳转到歌单页面
  toplaylist(e) {
    const playlistid = e.currentTarget.dataset.playlistid;
    wx.navigateTo({
      url: `/pages/playlist/playlist?playlistid=${playlistid}`,
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