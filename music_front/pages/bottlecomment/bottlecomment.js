// pages/bottlecomment/bottlecomment.js
import request from '../../utils/request';
import moment from 'moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottle: [],
    bocomment: '',
    commentinfo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let checkedbottle = [];
    checkedbottle = JSON.parse(options.bottle);
    this.setData({
      bottle: checkedbottle,
    })
    this.getComment();//获取漂流瓶回复
  },
  return () {
    wx.navigateTo({
      url: '/pages/bottle/bottle',
    })
  },
  //输入评论
  inputcomment(e) {
    this.setData({
      bocomment: e.detail.value,
    })
  },
  //发表评论
  async sendcomment() {
    if (this.data.bocomment != null) {
      let commentresult = await request.request2('/answerbottle', {
        content: this.data.bocomment,
        bottleid: this.data.bottle.bottleid,
        commenter:wx.getStorageSync('username'),
      }, 'POST');
      this.getComment();
      this.setData({
        bocomment: '',
      })
    }
  },
  //获取评论内容
  async getComment() {
    let comment = await request.request2('/getbottleanswer', {
      bottleid: this.data.bottle.bottleid,
    }, 'POST');
    if (comment.data.status === '200') { //若评论请求成功
      this.setData({
        commentinfo: comment.data.data.bottle_answer,
      })
    }
   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})