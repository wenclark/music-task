// pages/chartsdetail/chartsdetail.js
import Pubsub from 'pubsub-js';
import config from '../../utils/config'
import tool from '../../utils/tool'
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chartid: "",
    songindex: 0,
    songs: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.data.chartid = options.chartid;
    this.getsongs();
    //  //订阅chartdetail页面传来的切换歌曲方式
    //  Pubsub.subscribe('switchname', (message, type) => {
    //   //上一首歌
    //   if (type === 'pre') {
    //     if (this.data.songindex === 0) {
    //       this.setData({
    //         songindex: this.data.songs.length - 1,
    //       })
    //     } else {
    //       this.setData({
    //         songindex: this.data.songindex - 1,
    //       })
    //     }
    //     //下一首歌
    //   }
    //   if (type === 'next') {
    //     if (this.data.songindex === this.data.songs.length-1) {
    //       this.setData({
    //         songindex: 0,
    //       })
    //     } else {
    //       this.setData({
    //         songindex: this.data.songindex + 1,
    //       })
    //     }
    //   }
    //   this.setData({
    //     thissong: this.data.songs[this.data.songindex],
    //   })
    //   Pubsub.publish('currentid', this.data.thissong.id);
    // })
  },
  // 获得歌曲接口
  getsongs() {
    let that = this;
    wx.request({
      url: `${config.host}/playlist/detail?id=${this.data.chartid}`,
      method: 'GET',
      header: {
        cookie: wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_A=bf8bfeabb') != -1),
      },
      success(res) {
        that.setData({
          songs: res.data.playlist,
        })
      }
    })
  },
  //跳转到歌曲详情页面
  tosongdetail(e) {
    let {
      songid,
    } = e.currentTarget.dataset;
    if(songid){
      wx.navigateTo({
        url: `/pages/singdetail/singdetail?songid=${songid}&&songs=${encodeURIComponent(JSON.stringify(this.data.songs.tracks))}`,
      })
    }else{
      wx.navigateTo({
        url: `/pages/singdetail/singdetail?songs=${encodeURIComponent(JSON.stringify(this.data.songs.tracks))}`,
      })
    }
  }
})