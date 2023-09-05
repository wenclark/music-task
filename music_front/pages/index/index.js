// pages/index/index.js
import config from '../../utils/config';
import request from '../../utils/request';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgurl:"cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image",//云图片路径
    banner: [],
    recomend_move: [],
    recomend_static: [],
    music_listpart: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBanner();
    this.getRecom();
    this.getList();
  },
  //获取轮播图
  async getBanner() {
    let res;
    res= await request.request(`/banner?type=${2}`,'POST');
        this.setData({
           banner: res.data.banners,
         })
  },
  //获取推荐歌单
  async getRecom() {
    let res;
    res= await request.request(`/personalized?limit=${3}`);
    this.setData({
        recomend_move: res.data.result,
         })
    let res1;
    res1= await request.request(`/personalized?limit=${12}`);
    this.setData({
     recomend_static: res1.data.result,
     })
  },
  //获取榜单
 async getList() {
    let res;
    res= await request.request(`/toplist/detail`);
        this.setData({
          music_listpart: res.data.list.slice(0, 4),
        })
  },
  //跳转到每日推荐
  showsongs() {
    wx.navigateTo({
      url: '/pages/recommendsong/recommendsong',
    })
  },
  //跳转漂流瓶
  showbottle() {
    wx.navigateTo({
      url: '/pages/bottle/bottle',
    })
  },
  //跳转到分类歌单
  showclass(){
    wx.navigateTo({
      url: '/pages/classification/classificaiton',
    })
  },
  //跳转排行榜
  showchars() {
    wx.navigateTo({
      url: '/pages/charts/charts',
    })
  },
  //跳转到电台
  showradio(){
    wx.navigateTo({
      url: '/pages/radio/radio',
    })
  },
  //跳转到歌曲搜索页面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //跳转到歌单页面
  toplaylist(e) {
    const playlistid = e.currentTarget.dataset.playlistid;
    wx.navigateTo({
      url: `/pages/playlist/playlist?playlistid=${playlistid}`,
    })
  },
  //跳转到榜单详情页面
  tochart(e)
  {
    let index = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/chartsdetail/chartsdetail?chartid=${index}`,
    })
  }
})