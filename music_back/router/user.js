//接口路由配置


const express = require('express');
const router = express.Router();
const user = require('../router_handle/user');
const expressJoi = require('@escook/express-joi');
const {regist_Schema, login_Schema} = require('../schema/user');


//路由挂载
router.post('/login', expressJoi(login_Schema),user.user_login);
router.post('/regist',expressJoi(regist_Schema), user.user_regist);
router.post('/selavator',user.selavator);
router.post('/getavator',user.getavator);

module.exports = router;