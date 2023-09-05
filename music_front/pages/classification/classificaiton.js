// pages/classification/classificaiton.js
import request from '../../utils/request';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classlist:"",
    checked:[],
    checkedsong:[],
    hidden:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
         this.getclass();
  },
  async  getclass()
{
  let singclass= await request.request(`/playlist/catlist`);
  this.setData({ 
    classlist: singclass.data.sub.slice(0,69),
  })
  let i=0; let check=[];
  for(i=0;i<this.data.classlist.length;i++)
  {
      check[i]=0;
  }
  this.setData({ 
    checked:check,
  })
  // console.log(this.data.classlist);
},
getcheck(e)
{
  let i=e.currentTarget.dataset.index;
  if(this.data.checked[i])
  {
   this.data.checked[i]=0;
   this.setData({
     checked:this.data.checked,
   })
  }
   else
   {
    this.data.checked[i]=1;
    this.setData({
      checked:this.data.checked,
    })
   }
},
async gosing()
{
  let i=0;let sing=[];
  for(i=0;i<this.data.checked.length;i++)
  {
    if(this.data.checked[i]==1)
    sing.push(this.data.classlist[i].name);
  }
  this.setData({
    checkedsong:sing,
  })
  if(this.data.checkedsong[0]!=null)
  {
    wx.navigateTo({
      url: `/pages/classfsing/classfsing?checkedsong=`+JSON.stringify(this.data.checkedsong),
    })
  }
  else
  {
   this.setData({hidden:false,})
   setTimeout(() => {
    this.setData({
     hidden: true,
    })
  }, 2000)
  }
}
})
