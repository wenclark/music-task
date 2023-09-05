//防抖
let t = null;
let flag = true; //写在函数内部会出问题，要用全局变量，否者每次点击都会赋初值
const deBounce =  (fn, delay) => {
  return function () {
    clearTimeout(t);
    t = setTimeout(() => {
      fn();
    }, delay);
  }
}
//节流
const throttle = (fn, delay) => {
  return function () {
    if (flag) {
      setTimeout(() => {
        fn.call(this, arguments);
        flag = true;
      }, delay)
    }
    flag = false;
  }
}

//格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

//时间数字自动补零
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//计算数组里与目标值最近值的索引
const nearlyindex = (arr, num) => {
  let pos = 0;
  for(let i=1;i<arr.length;i++){
    if(Math.abs(arr[i]-num) <=Math.abs(arr[i-1]-num)){
      pos=i;
    }
  }
  return pos;
}
module.exports = {
  deBounce,
  throttle,
  formatTime,
  formatNumber,
  nearlyindex,
}