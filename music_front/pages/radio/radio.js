// pages/radio/radio.js
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radiolist: [], //电台分类
    radiodatalist: [], //分类电台数据
    checked: 0, //分类索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.getradiolist();
    let radiofo;
    radiofo = await request.request(`/dj/radio/hot?cateId=${3}`);
    this.setData({
      radiodatalist: radiofo.data.djRadios,
    })
  },
  //获取电台分类标签数据
  async getradiolist() {
    let radiodata = await request.request(`/dj/catelist`);
    this.setData({
      radiolist: radiodata.data.categories,
    })
    // console.log(this.data.radiolist);
  },
  //获取点击导航的索引
  async checkedindex(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    this.setData({
      checked: index,
      id: id,
    })
    this.toradio(this.data.id);
  },
  //获得分类电台下的推荐
  async toradio(a) {
    let radiofo;
    radiofo = await request.request(`/dj/radio/hot?cateId=${a}`);
    this.setData({
      radiodatalist: radiofo.data.djRadios,
    })
    // console.log(this.data.radiodatalist);
  },

  tovedio(e) {
    let index = e.currentTarget.dataset.id;
    console.log(index);
    wx.navigateTo({
      url: `/pages/radiolist/radiolist?radioid=${index}`,
    })
  },
  onTouchMove(){
    return false;
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