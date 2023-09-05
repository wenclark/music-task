const express = require('express');
const Joi = require('joi');
const app = express();


//配置数据格式处理中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//路由配置
const user_Router = require('./router/user');
const song_Router = require('./router/song');
const bottle_Router = require('./router/bottle');
app.use('/app', user_Router);
app.use('/',song_Router);
app.use('/',bottle_Router);

//跨域配置
const cors = require('cors')
app.use(cors())




//错误中间件
app.use((err, req, res, next) => {
    if (err instanceof Joi.ValidationError) return (
        res.send({
            status: '100',
            message: err.message,
        }))
    res.send({
        status: '100',
        message: err.message,
    })
    next();
})


//开启服务器
app.listen(8081, (req, res) => {
    console.log('service is runing at http://127.0.0.1:8081');
})