// pages/bottle/bottle.js
import request from '../../utils/request';
import moment from 'moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image", //云图片路径
    hid: true,
    text: "",
    throwai: false,
    /**是否已经扔了瓶子，是否开启扔瓶子动画 */
    net: false,
    /*是否要捞瓶子 */
    nettd: false,
    /*是否要捞瓶子 */
    texthid: true, //是在隐藏
    isfinish: true, //一次捞取是否完成
    bottleindex: '',
    netb: [{
        type: "倾诉瓶",
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/net1.png"
      },
      {
        type: "提问瓶",
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/net2.png"
      },
      {
        type: "交往瓶",
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/net3.png"
      },
      {
        type: "祝愿瓶",
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/net4.png"
      },
      {
        type: "发泄瓶",
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/net5.png"
      },
      {
        type: "秘密瓶",
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/net6.png"
      },
      {
        type: "空瓶子",
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/wang.png"
      }
    ],
    list: [{
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/b1.png",
        name: "倾诉瓶",
        checked: true,
      },
      {
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/b2.png",
        name: "提问瓶",
        checked: false,
      },
      {
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/b3.png",
        name: "交往瓶",
        checked: false,
      },
      {
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/b4.png",
        name: "祝愿瓶",
        checked: false,
      },
      {
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/b6.png",
        name: "发泄瓶",
        checked: false,
      },
      {
        img: "cloud://musictask-6gpn7053b831a4ab.6d75-musictask-6gpn7053b831a4ab-1317070265/image/b8.png",
        name: "秘密瓶",
        checked: false,
      }
    ],
    mybottonpage: false, //我的瓶子页面
    netbottonpage: true, //已捞到的瓶子页面
    showmyBox: false, //是否展示我的配置
    bottlelist: [], //捞取上来的漂流瓶
    mybottle:[],//我丢掉漂流瓶
    type:"倾诉瓶",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.showmybpage();//默认显示我丢掉瓶子页面
  },
  //查看我的瓶子
  mybottle() {
    this.setData({
      showmyBox: true,
    })
    this.getmybottle();
  },
  //获取漂流瓶内容
  gettext: function (e) {
    this.setData({
      text: e.detail.value
    })
  },
  //获取漂流瓶类型
  gettype: function (e) {
    let index = e.currentTarget.dataset.id;
    let list = this.data.list;
    for (let i = 0; i < list.length; i++) {
      this.data.list[i].checked = false;
    }
    if (list[index].checked) {
      this.data.list[index].checked = false;
    } else {
      this.data.list[index].checked = true;
    }
    this.setData({
      list: this.data.list,
      type: e.currentTarget.dataset.type,
    })
  },
  //关闭扔漂流瓶页面
  closepage() {
    this.setData({
      hid: true,
    })
  },
  //显示扔漂流瓶页面
  showpage() {
    this.setData({
      hid: false,
      text: "",
    })
  },
  //显示我丢的瓶子页面
  showmybpage() {
    this.setData({
      mybottonpage: false,
      netbottonpage: true,
    })
    this.getmybottle();
  },
  //显示捞起来的瓶子
  netmybpage() {
    this.setData({
      mybottonpage: true,
      netbottonpage: false,
    })
    this.getreceivebottle();
  },

  //捞漂流瓶
  async netbottle() {
    if (this.data.isfinish) { //判断前一次捞取事件是否完成
      this.setData({
        isfinish: false,
      })
      clearTimeout(t1, t2, t3);
      let bottleindex = Math.floor(Math.random() * 7); //随机获取一个类型的漂流瓶
      this.setData({
        net: true,
        bottleindex: bottleindex,
      })
      //定时器1结束执行捞动画
      let t1 = setTimeout(() => {
        this.setData({
          net: false,
          nettd: true,
        })
      }, 4500);
      //定时器2结束执行捞出动画
      let t2 = setTimeout(() => {
        this.setData({
          nettd: false,
          texthid: false,
        })
      }, 6500)
      //定时器3结束显示捞出展示
      let t3 = setTimeout(async () => {
        this.setData({
          texthid: true,
          isfinish: true,
        })
        if (bottleindex <= 5) { //非空瓶子时请求接口
          let findbottle = await request.request2('/getbottle', {
            type: this.data.netb[bottleindex].type,
          }, 'POST');
          if (findbottle.data.data.content) {//捞出时存入我的瓶子
            this.storebottle(findbottle.data.data.content);
          }
        }
      }, 8000);
    }
  },

  // 扔漂流瓶
  async throwbottle() {
    if (this.data.text == "") {
      console.log("你不能丢入瓶子，请书写内容");
    }
    if (this.data.text != "") {
      this.setData({
        hid: true,
        throwai: true,
      })
      setTimeout(() => {
        this.setData({
          throwai: false,
        })
      }, 5000)
      console.log("成功丢了一个");
      let user = wx.getStorageSync('username');
      let content = this.data.text;
      let type = this.data.type;
      let a = await request.request2('/setbottle', {
        user,
        content,
        type,
      }, 'POST');
    }

  },

  //关闭我的瓶子页面
  closemypage() {
    this.setData({
      showmyBox: false,
    })
  },

  //存入捞起瓶子
  async storebottle(bottleinfo) {
    let bottleid = bottleinfo.bottleid;
    let content = bottleinfo.content;
    let type = bottleinfo.type;
    let storeanswer = await request.request2('/storebottle', {
      bottleid,
      content,
      type,
      owner: wx.getStorageSync('username'),
    }, 'POST')
  },

  //获取捞的漂流瓶
  async getreceivebottle() {
      let bottlelist = (await request.request2('/receivebottle',{
        user:wx.getStorageSync('username'),
      },'POST')).data.data;
      this.setData({
        bottlelist:bottlelist,
      })
  },

  //获取当前用户丢的漂流瓶
  async getmybottle(){
    let time=[];
    let mybottle = (await request.request2('/mybottle',{
      user:wx.getStorageSync('username'),
    },'POST')).data.data;
    for (let i = 0; i < mybottle.length; i++) { //格式化时间
      mybottle[i].sendtime = moment(mybottle[i].sendtime).format('YYYY-MM-DD')
    }
    this.setData({
      mybottle,
    })
  },

  //跳转到漂流瓶评论
  tocomment(e)
  {
    if(this.data.mybottonpage==false)
    {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/bottlecomment/bottlecomment?bottle=`+JSON.stringify(this.data.mybottle[index]),
    })
   }
   if(this.data.netbottonpage==false)
   {
   let index = e.currentTarget.dataset.index;
   console.log(index);
   wx.navigateTo({
     url: `/pages/bottlecomment/bottlecomment?bottle=`+JSON.stringify(this.data.bottlelist[index]),
   })
  }
  },

  pushbottle(e){
    let bottleid = e.currentTarget.dataset.bid;
    wx.showModal({
      title: '是否将此漂流瓶扔回',
      content: '',
      complete: (res) => {
        if (res.cancel) {
          
        }
    
        if (res.confirm) {
          let pushmsg = request.request2('/pushbottle',{
            bottleid,
        },'POST');
           this.getreceivebottle();
           this.getmybottle();
        }
      }
    })
  }
})