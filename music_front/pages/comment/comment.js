// pages/comment/comment.js
import request from '../../utils/request';
import tool from '../../utils/tool';
import moment from 'moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songid: ' ',
    songinfo: ' ',
    comment_time: [],
    commentinfo: [],
    subcomment: '',
    showpressBox: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let songid = options.songid;
    this.setData({
      songid: songid,
    })
    this.getComment(songid);
    this.getImg();
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

  //获取评论内容
  async getComment(songid) {
    let comment = await request.request2('/getcomment', {
      songid: songid
    }, 'POST');
    // console.log(comment);
    if (comment.data.status === '200') { //若评论请求成功
      let comment_time = []; //存评论时间
      this.setData({
        commentinfo: comment.data.data,
      })
      for (let i = 0; i < this.data.commentinfo.length; i++) { //格式化评论时间
        comment_time.push(moment(this.data.commentinfo[i].comment_time).format('YYYY-MM-DD'));
      }
      this.setData({
        comment_time,
      })
    }
  },

  //获取歌曲信息
  async getImg() {
    let songinfo = (await request.request(`/song/detail?ids=${this.data.songid}`)).data.songs;
    this.setData({
      songinfo: songinfo[0],
    })
  },

  //输入评论
  inputComment(e) {
    this.setData({
      subcomment: e.detail.value,
    })
  },

  //发表评论
  async sendComment() {
    let username = wx.getStorageSync('username');
    if (this.data.subcomment != null) {
      let commentresult = await request.request2('/setcomment', {
        songid: this.data.songid,
        username,
        comment: this.data.subcomment
      }, 'POST');
      this.getComment(this.data.songid);
      this.setData({
        subcomment: '',
      })
    }
  },

  //显示删除框
  showpressbox(e) {
    wx.showModal({
      title: '是否删除这条评论',
      content: '',
      complete: (res) => {
        if (res.confirm) { //点击确认按钮
          let press_pos = e.currentTarget.dataset.pos;
           this.deletComment(press_pos);
          this.getComment(this.data.songid);
        }
      }
    })
  },

  //删除评论(参数为评论id)
  async deletComment(pos) {
    let comment_user = this.data.commentinfo[pos].username;
    let commentid = this.data.commentinfo[pos].id;
    if (comment_user === wx.getStorageSync('username')) { //若是本人评论允许删除
      let message = await request.request2('/delcomment', {
        username: comment_user,
        id: commentid
      }, 'POST');
    } else {
      wx.showToast({
        title: '禁止删他人评论',
      })
    }
  },
})