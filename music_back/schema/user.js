//验证规则


const joi = require('joi');
const username = joi.string().alphanum().min(3).max(8).required();//字母或数字，3到8位数，必需
const password = joi.string().alphanum().length(6).required();//字母或数字，5位数，必需


//注册用户规则
exports.regist_Schema = {
    body: {
        username,
        password,
    }
}
//登录规则
exports.login_Schema = {
    body: {
        username,
        password,
    }
}