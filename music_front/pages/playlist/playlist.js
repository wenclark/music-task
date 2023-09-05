// pages/playlist/playlist.js
import request from '../../utils/request';
import Pubsub from 'pubsub-js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlistinfo: '', //歌单详情
    playlist: '', //歌单歌曲
    songindex:0,//当前歌曲下标
    thissong:'',//目标歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const playlistid = options.playlistid;
    this.getplaylist(playlistid);
    this.getplaylistinfo(playlistid);
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

  //获取歌单详情
  async getplaylistinfo(playlistid) {
    let playlistinfo = (await request.request(`/playlist/detail?id=${playlistid}`)).data.playlist;
    let listinfo = {
      tags: playlistinfo.algTags,
      pic: playlistinfo.coverImgUrl,
      name: playlistinfo.name,
    };
    this.setData({
      playlistinfo:listinfo,
    })
    // console.log(listinfo);
  },

  //获取歌单歌曲
  async getplaylist(playlistid) {
    let playlist = (await request.request(`/playlist/track/all?id=${playlistid}&limit=10`)).data.songs;
    this.setData({
      playlist: playlist,
    })
  },

  //跳转到歌单单曲
  tolistsong(e){
    let songid = e.currentTarget.dataset.songid;
    if(songid){
      wx.navigateTo({
        url: `/pages/singdetail/singdetail?songid=${songid}&&songs=${encodeURIComponent(JSON.stringify(this.data.playlist))}`,
      })
    }else{
      wx.navigateTo({
        url: `/pages/singdetail/singdetail?songs=${encodeURIComponent(JSON.stringify(this.data.playlist))}`,
      })
    }
  }
})