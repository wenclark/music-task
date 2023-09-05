// pages/radiodetail/radiodetail.js
import Pubsub from 'pubsub-js';
import moment from 'moment';
import config from '../../utils/config';
import request from '../../utils/request';
import tool from '../../utils/tool';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioname:'',
    radioimg:'',
    radiotime:'',
    radiodec:'',
    isPlay: true, //音乐是否在播放
    songid: '',
    songinfo: '',
    scrollTop: 0,
    curtime: '00:00', //进度栏当前时间
    alltime: '', //歌曲总时间
    progress: '', //进度栏滑块长度
    scrollTimer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let songid = options.songid;
    let radioname=options.radioname;
    let radioid=options.radioid;
    let radio;
   radio = await request.request(`/dj/program/detail?id=${radioid}`);
   let radioimg=radio.data.program.coverUrl;
   let radiodec=radio.data.program.description;
  //  console.log(radio);
    let radiotime=parseInt(options.radiotime);
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.setData({
      songid,
      radioname,
      radiotime,
      radioimg,
      radiodec,
    })
    // console.log(this.data.radiotime);
    await this.getsongInfo();
    // //播放歌曲
     this.musicContro(this.data.isPlay);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearInterval(this.data.scrollTimer);
  },
  //按钮开起播放
  async startmusic() {
    this.setData({
      isPlay: true,
    })
    this.musicContro(this.data.isPlay);
  },

  //按钮暂停播放
  async stopmusic() {
    clearInterval(this.data.scrollTimer);
    this.setData({
      isPlay: false,
      curtime: moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss'),
    })
    this.musicContro(this.data.isPlay);
  },
  //获取音乐歌手，图片等信息
  async getsongInfo() {
    let that = this;
    // //等歌曲信息songinfo获取后再修改alltime（若写在一个setDate里会出错，因为setDate是一个同步方法，获取alltime时，歌曲信息可能还未修改）
     this.setData({
       alltime: moment(this.data.radiotime).format('mm:ss'),
     })
    //  console.log(this.data.alltime);
  },
  //控制歌曲播放
  async musicContro(isPlay) {
    let that =this;
    //监听系统开启播放
    this.backgroundAudioManager.onPlay(() => {
      that.setData({
        isPlay: true,
      })
    })
    //监听系统暂停播放
    this.backgroundAudioManager.onPause(() => {
      that.setData({
        isPlay: false,
      })
    })
    //监听真机关闭播放
    this.backgroundAudioManager.onStop(() => {
      that.setData({
        isPlay: false,
      })
    })
    //获取音乐mp3链接
    if (this.data.isPlay) {
      let result, musiclink;
      result = await request.request(`/song/url?id=${this.data.songid}`);
      musiclink = result.data.data[0].url;
      //设置背景音乐播放路径
      this.backgroundAudioManager.src = musiclink;
      this.backgroundAudioManager.startTime = this.data.curtime;
      this.backgroundAudioManager.title = this.data.radioname;
      this.backgroundAudioManager.play();
      this.backgroundAudioManager.onTimeUpdate(() => {
        this.setData({
          curtime: moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss'),
          progress: this.backgroundAudioManager.currentTime * 1000 / this.data.radiotime * 100,
        })
      })
    } else {
      this.backgroundAudioManager.pause()
    }
  },
  //进度栏控制歌曲播放，歌词定位
   changeProgress(e) {
    this.setData({
      curtime: moment(parseInt(this.data.radiotime * e.detail.value / 100)).format('mm:ss')
    })
    //跳转到滑动位置
    this.backgroundAudioManager.seek(parseInt(this.data.radiotime * e.detail.value / 100) / 1000);
    //进度条到100自动切换
    if (e.detail.value === 100) {
      clearInterval(this.data.scrollTimer);
      Pubsub.publish('switchname', 'next');
      Pubsub.subscribe('currentid', (msg, id) => {
        this.setData({
          songid: id,
          isPlay: true,
          scrollTop: 0,
          lrclocation: 0
        })
        this.getsongInfo();
        this.musicContro(this.data.isPlay);
        this.getLrc();
        Pubsub.unsubscribe('currentid');
      })
    }
  },
  //显示磁盘页面
  showLigthdisk(){
    this.setData({
      showlrc:false,
    })
  },
  //返回上一个页面
  backpage(){
    wx.navigateBack({
      delta:1,
    })
  }
})
