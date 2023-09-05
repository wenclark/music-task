import config from './config'
//请求网易云接口
const request = (url, data, method = 'GET',needLogin = 0) => {
  return new Promise((resolve,reject) => {
    if(needLogin){//需要验证网易云登陆时，请求头携带cookie
      wx.request({
        url:config.host+url,
        data,
        method,
        header: {
          "content-type": "application/x-www-form-urlencoded",
           cookie:wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_A=bf8bfeabb')!=-1),
        },
        success:(res)=>{
          resolve(res);
        },
        fail:(err)=>{
          reject(err);
        }
      })
    }
    else{//不需要网易云登陆验证时
      wx.request({
        url:config.host+url,
        data,
        method,
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
        success:(res)=>{
          resolve(res);
        },
        fail:(err)=>{
          reject(err);
        }
      })
    }
  })
}
//请求本地接口
const request2 = (url, data, method = 'GET') => {
  return new Promise((resolve,reject) => {
    wx.request({
      url:config.myhost+url,
      data,
      method,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
module.exports  = {
  request,
  request2
}