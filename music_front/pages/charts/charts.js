// pages/charts/charts.js
import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    music_listall: [],
    music_listpart:[],
    music_allcircle:[],
    music_language:[],
    music_language1:[],
    gufeng:[],
    shuochang:[],
    minyao:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getList();
   this. getancient1();
   this. getancient2();
   this. getancient3();
  },
  //获取古风，说唱，民谣榜单
  getancient1() {
    var that = this;
     wx.request({
       url: `${config.host}/playlist/detail?id=71384707`,
       method: 'GET',
       success(res) {
         that.setData({
          gufeng:res.data.playlist,
         })
       }
     })
   },
   togufeng()
   {
    wx.navigateTo({
      url: `/pages/chartsdetail/chartsdetail?chartid=${71384707}`,
    })
   },
    getancient2() {
    var that = this;
     wx.request({
       url: `${config.host}/playlist/detail?id=991319590`,
       method: 'GET',
       success(res) {
         that.setData({
          shuochang:res.data.playlist,
         })
       }
     })
   },
   toshuochang()
   {
    wx.navigateTo({
      url: `/pages/chartsdetail/chartsdetail?chartid=${991319590}`,
    })
   },
   getancient3() {
    var that = this;
     wx.request({
       url: `${config.host}/playlist/detail?id=5059661515`,
       method: 'GET',
       success(res) {
         that.setData({
          minyao:res.data.playlist,
         })
       }
     })
   },
   tominyao()
   {
    wx.navigateTo({
      url: `/pages/chartsdetail/chartsdetail?chartid=${5059661515}`,
    })
   },
   // 获得精选榜单
  getList() {
    var that = this;
    wx.request({
      url: `${config.host}/toplist/detail`,
      method: 'GET',
      success(res) {
        that.setData({
          //将排行榜整体返回数据按类别分裂
          music_listall: res.data.list.slice(18,23),
          music_listpart :res.data.list.slice(0,7),
          music_allcircle:res.data.list.slice(11,16),
          music_language:res.data.list.slice(16,18),
          music_language1:res.data.list.slice(30,32),
        })
      }
    })
  },
 tese(e)
 {
  let index = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: `/pages/chartsdetail/chartsdetail?chartid=${index}`,
  })
 }
})
