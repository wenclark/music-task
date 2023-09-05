// pages/search/search.js
import tool, {
  deBounce,
  throttle
} from '../../utils/tool'
import request from '../../utils/request'
let t;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchBox: [],
    hotsong: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this.gethotSong();
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


  //查询歌曲
  searchSong(e) {
    this.setData({
      searchBox: [],
    })
    let searchsong, searchsongbox;
    deBounce(async () => {
      searchsong = e.detail.value;
      if (searchsong) {
        this.setData({
          searchBox: (await request.request('/search', {
            keywords: searchsong,
            limit: 12,
          })).data.result.songs,
        })
      }
    }, 300)();
  },

  //获取热门歌曲推荐
  async gethotSong() {
    let hotsong = await request.request('/search/hot/detail');
    this.setData({
      hotsong: hotsong.data.data,
    })
  },

  //跳转到查询歌曲
  toSearchsong(e){
    let songid=e.currentTarget.dataset.songid;
    wx.navigateTo({
      url: `/pages/singdetail/singdetail?songid=${songid}`,
    })
  }
})