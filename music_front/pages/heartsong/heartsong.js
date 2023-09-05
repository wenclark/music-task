// pages/heartsong/heartsong.js
import request from '../../utils/request';
import moment from 'moment';
import tool from '../../utils/tool';
import Pubsub from 'pubsub-js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songid: '',
    isPlay: true, //音乐是否在播放
    allrun: true, //是否循环播放
    songinfo: '',
    scrollTop: 0,
    curtime: '00:00', //进度栏当前时间
    alltime: '', //歌曲总时间
    progress: '', //进度栏滑块长度
    lrctime: [], //歌词时间点
    lrcword: [], //歌词
    lrcBoxheight: 0, //歌词播放区高度
    lrclocation: 0, //当前显示歌词索引值
    scrollTimer: null,
    scrollThreshold: 3, //歌词滚动门限值
    iscollect: false,
    showheart: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // let songid = options.songid;
    // this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // if (!songid) { //点击心动模式进入
    //   this.setData({
    //     songid: JSON.parse(options.songs)[0].songid,
    //     songs: JSON.parse(options.songs),
    //   })
    // } else { //点击心动单曲进入
    //   this.setData({
    //     songid,
    //     songs: JSON.parse(options.songs),
    //   })
    // }
    // await this.getsongInfo();
    // //获取歌词
    // await this.getLrc();
    // //播放歌曲
    // this.musicContro(this.data.isPlay);
    // //默认为顺序播放
    // this.autoPlay(this.data.allrun);

    let songid = options.songid;
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.setData({
      songid,
    })
    await this.getsongInfo();
    //获取歌词
    await this.getLrc();
    //播放歌曲
    this.musicContro(this.data.isPlay);
    //默认为顺序播放
    this.autoPlay(this.data.allrun);
    // this.repeatscroll();
    this.setData({
      showheart: true,
    })
    let t = setInterval(() => {
      this.setData({
        showheart: false,
      })
    }, 2000);

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

  //返回上一个页面
  backpage() {
    wx.navigateBack({
      delta: 1,
    })
  },

  //获取音乐歌手，图片等信息
  async getsongInfo() {
    let that = this;
    let songinfo;
    songinfo = await request.request(`/song/detail?ids=${that.data.songid}`);
    this.setData({
      songinfo: songinfo.data.songs[0],
      iscollect: false,
    })
    //等歌曲信息songinfo获取后再修改alltime（若写在一个setDate里会出错，因为setDate是一个同步方法，获取alltime时，歌曲信息可能还未修改）
    this.setData({
      alltime: moment(this.data.songinfo.dt).format('mm:ss'),
    })
    //判断当前是否为收藏歌
    // this.judgeCollect();
  },

  //按钮开起播放
  async startmusic() {
    this.setData({
      isPlay: true,
    })
    this.musicContro(this.data.isPlay);
    //暂停后从暂停位置歌词继续滚动
    this.lrcstrollschema(this.data.lrctime[this.data.lrclocation + 1] -
      this.backgroundAudioManager.currentTime * 1000,
      this.data.lrclocation + 1);
  },

  //按钮暂停播放
  async stopmusic() {
    clearInterval(this.data.scrollTimer);
    this.setData({
      isPlay: false,
      curtime: moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss'),
    })
    this.musicContro(this.data.isPlay);
    this.lrcscroll(this.data.isPlay);
  },

  //切换顺序播放
  async looprun() {
    wx.showToast({
      title: '切换至顺序播放',
    })
    this.setData({
      allrun: true,
    })
    this.autoPlay(this.data.allrun);
  },

  //切换单曲循环
  async notloop() {
    wx.showToast({
      title: '切换至循环播放',
    })
    this.setData({
      allrun: false,
    })
    this.repeatSong(this.data.allrun);
  },

  //切换音乐
  switchsong(e) {
    clearInterval(this.data.scrollTimer);
    let switchway = e.currentTarget.dataset.switch;
    this.backgroundAudioManager.stop();
    //发布歌曲切换方式
    Pubsub.publish('switchname', switchway);
    //点击切换后，订阅推荐歌曲页面发布的下一首歌曲id
    Pubsub.subscribe('currentid', (msg, id) => {
      this.setData({
        songid: id,
        isPlay: true,
        scrollTop: 0,
        lrclocation: 0,
      })
      this.getsongInfo();
      this.getLrc();
      this.musicContro(this.data.isPlay);
      Pubsub.unsubscribe('currentid');
    })
  },


  //控制歌曲播放
  async musicContro(isPlay) {
    let that = this;
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
      this.backgroundAudioManager.title = this.data.songinfo.name;
      this.backgroundAudioManager.play();
      this.backgroundAudioManager.onTimeUpdate(() => {
        this.setData({
          curtime: moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss'),
          progress: this.backgroundAudioManager.currentTime * 1000 / this.data.songinfo.dt * 100,
        })
      })
    } else {
      this.backgroundAudioManager.pause()
    }
  },

  //进度栏控制歌曲播放，歌词定位
  changeProgress(e) {
    this.setData({
      curtime: moment(parseInt(this.data.songinfo.dt * e.detail.value / 100)).format('mm:ss')
    })
    //跳转到滑动位置
    this.backgroundAudioManager.seek(parseInt(this.data.songinfo.dt * e.detail.value / 100) / 1000);
    //进度栏控制歌词滚动
    this.matchLrc(this.data.songinfo.dt * e.detail.value / 100);
    this.lrcscroll(this.data.isPlay); //滑动到指定位置后歌词继续滚动
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

  //歌词与进度匹配(参数为当前歌曲时间点)
  matchLrc(curTimenode) {
    let targetLocation = tool.nearlyindex(this.data.lrctime, curTimenode); //匹配到最近的歌词索引
    let moveDistance = 0;
    if (targetLocation >= this.data.scrollThreshold) {
      for (let i = this.data.scrollThreshold; i < targetLocation; i++) {
        moveDistance += this.lrcstrollschema.domArr[i].height + 8; //每次移动每行高度+边框高度
      }
      this.setData({
        lrclocation: targetLocation,
        scrollTop: moveDistance,
      })
    } else {
      this.setData({
        lrclocation: targetLocation,
        scrollTop: moveDistance,
      })
    }
  },

  //滑动点击歌词控制进度
  LrcControlmusic(e) {
    let targettimenode = this.data.lrctime[e.currentTarget.dataset.location];
    //跳转到滑动位置
    this.backgroundAudioManager.seek(targettimenode / 1000);
    this.matchLrc(targettimenode);
    this.lrcscroll(this.data.isPlay); //滑动到指定位置后歌词继续滚动(如果不再次调用该方法会回到点击前位置滚动，有bug)
  },

  //自动顺序播放
  autoPlay(allrun) {
    //歌曲播放完自动下一曲
    if (allrun) {
      this.backgroundAudioManager.onEnded(() => {
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
      })

    }
  },

  //实现歌曲单曲循环
  repeatSong(allrun) {
    if (!allrun) {
      this.backgroundAudioManager.onEnded(() => {
        this.setData({
          scrollTop: 0,
          lrclocation: 0
        })
        this.musicContro(this.data.isPlay); //音乐开始播放
        this.lrcscroll(this.data.isPlay); //歌词开始自动滚动
      })
    }
  },

  //获取歌词以及歌词滚动显示
  async getLrc() {
    let lrcinfo = await request.request(`/lyric?id=${this.data.songid}`);
    let lrc = lrcinfo.data.lrc.lyric;
    this.formatLrc(lrc); //格式化歌词
    this.lrcscroll(this.data.isPlay); //歌词滚动
  },

  //格式化歌词
  formatLrc(lrc) {
    let lrctime = []; //存歌词时间节点
    let lrcword = []; //存歌词
    lrc = lrc.split(/\n/g); //按换行分割歌词
    lrc.map(item => { //遍历分割后歌词字符串数组
      let timestr = item.match(new RegExp("\\[[0-9]*:[0-9]*.[0-9]*\\]", "g")); //匹配时间节点字符串
      if (timestr) {
        timestr = timestr[0].replace('[', '').replace(']', ''); //删除时间点两侧中括号
        let time = Number(timestr.split(':')[0] * 60 * 1000) + Number(timestr.split(':')[1].split('.')[0] * 1000) + Number(timestr.split(':')[1].split('.')[1]); //将时间字符穿转为秒数）
        lrctime.push(time);
        lrcword.push(item.replace((new RegExp("\\[(.*)\\]", "g")), "")); //将item里单字符替换为空，剩下的是汉字
      }
    })
    this.setData({
      lrctime,
      lrcword,
    })
  },

  //歌词滚动
  lrcscroll(isScroll) {
    clearInterval(this.data.scrollTimer);
    //开启定时器
    if (isScroll) {
      if (!this.lrcscroll.isFirstEntry) { //若是第一次进入歌词页面
        this.lrcscroll.isFirstEntry = true
        setTimeout(() => {
          this.lrcstrollschema(this.data.lrctime[this.data.lrclocation + 1] -
            this.data.lrctime[this.data.lrclocation],
            this.data.lrclocation + 1);
        }, this.data.lrctime[this.data.lrclocation])
      } else { //非初次进入歌词页面
        this.lrcstrollschema(this.data.lrctime[this.data.lrclocation + 1] -
          this.data.lrctime[this.data.lrclocation],
          this.data.lrclocation + 1);
      }
    } else { //暂停时关闭定时器
      clearTimeout(this.data.scrollTimer);
    }
  },

  //歌词滚动计算(参数为滚动时延,下一句歌词索引)
  lrcstrollschema(delay, nextLocation) {
    let query = wx.createSelectorQuery(); //获取歌词dom节点
    query.selectAll('.songlrc').boundingClientRect((res) => {
      this.lrcstrollschema.domArr = res
    }).exec();
    this.data.scrollTimer = setTimeout(() => { //开启滚动定时器
      let currentDistance = nextLocation <= this.data.scrollThreshold ? 0 : this.data.scrollTop + this.lrcstrollschema.domArr[this.data.lrclocation - this.data.scrollThreshold].height + 10; //计算每行的滚动距离
      this.setData({
        scrollTop: currentDistance,
        lrclocation: nextLocation
      })
      if (this.data.lrclocation < this.data.lrctime.length - 1) { //判断是否到最后
        this.lrcstrollschema((this.data.lrctime[this.data.lrclocation + 1] - this.data.lrctime[this.data.lrclocation]), this.data.lrclocation + 1); //通过时间点之差计算滚动时延（参数单位为毫秒）
      }
    }, delay);
  },

  //转到歌曲评论页面
  tocomment() {
    this.stopmusic();
    wx.navigateTo({
      url: `/pages/comment/comment?songid=${this.data.songid}`,
    })
  },

})