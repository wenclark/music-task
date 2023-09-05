// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image", //云图片路径
    history: [],
    songindex:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.showhistory();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.showhistory();
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

  //展示历史数据
  showhistory() {
    let history = wx.getStorageSync('historysong');
    let newarr = [];
    for(let i = history.length-1;i>0;i--){
      newarr.push(history[i]);
    }
    this.setData({
      history:newarr,
    })
  },
  //返回上一个页面
  backpage() {
    wx.navigateBack({
      delta: 1,
    })
  },
  //跳转单曲
  tosong(e) {
    let songid = e.currentTarget.dataset.songid;
    this.setData({
      songindex: e.currentTarget.dataset.index,
    })
    wx.navigateTo({
      url: `/pages/singdetail/singdetail?songid=${songid}`,
    })
  }
})