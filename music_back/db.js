//数据库配置
const mysql = require('mysql');
const db = mysql.createPool(
    {
        host:'127.0.0.1',
        user:'root',
        password:'ROOT',
        database:'music_task',
    }
)


module.exports=db;
