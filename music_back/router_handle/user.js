//接口逻辑代码


const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//登录接口(需要传入用户名，密码)
exports.user_login = (req, res) => {
    // console.log(req.body);
    const login_info = req.body;
    const sel_sql = 'select * from users where username = ?';
    db.query(sel_sql, login_info.username, (err, result) => {
        if (err) console.log('用户登录失败' + err.message);
        if (!result[0]) {                                                //用户不存在
            return res.send({
                status: '100',
                message: '该用户不存在，请注册后重新登陆！',
            })
        }
        else {                                                           //判断登录信息是否正确
            if (!bcrypt.compareSync(login_info.password, result[0].password)) {
                return res.send({
                    status: '100',
                    message: '密码错误，请重新输入密码！',
                })
            }
            //成功登录
            
            res.send({
                status: '200',
                message: `登录成功，欢迎${result[0].username}`,
            })
        }
    })
}

//注册接口(需要传入用户名，密码)
exports.user_regist = (req, res) => {
    let regist_info = req.body;
    const sel_sql = 'select * from users where username = ?';
    db.query(sel_sql, regist_info.username, (err, result) => {
        if (result[0]) {                                                     //检验用户名是否存在
            console.log('用户名已存在');
            return res.send({
                status: '100',
                message: '用户名已存在，请重新输入。',
            })
        }
        else {
            regist_info.password = bcrypt.hashSync(regist_info.password, 10);//对用户密码加密，盐长度为10
            const add_sql = 'insert into users SET ?';
            db.query(add_sql, regist_info, (err, result) => {                //用户信息存入数据库
                if (err) {
                    console.log('注册失败' + err.message);
                    return res.send({
                        status: '100',
                        message: err.message,
                    })
                }
                else {
                    if (result.affectedRows === 1) console.log('注册成功');
                }
            });
            res.send({
                status: '200',
                message: '用户注册成功!',
            })
        }
    })
}

//选择头像（需要传入头像url,用户名）
exports.selavator = (req,res) => {
    let userinfo = req.body;
    const setavatorsql = `update users set pic = '${userinfo.pic}' where username = ?`;
    // console.log(setavatorsql);
    db.query(setavatorsql,userinfo.username,(err,sqlres)=>{
        if(err) console.log(err.message);
        else{
            if(sqlres.affectedRows === 1){
                res.send({
                    status:'200',
                    message:'request ok!',
                })
            }
        }
    })
} 

//获取用户头像（需传入用户名）
exports.getavator = (req,res) => {
    let getavatorsql='select pic from users where username = ?';
    db.query(getavatorsql,req.body.username,(err,getres) =>{
        if(err)console.log(err.message);
        else{
            if(getres){
                res.send({
                    status:'200',
                    message:'request ok !',
                    data:getres,
                })
            }
        }
    })

}