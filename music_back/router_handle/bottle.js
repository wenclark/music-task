const db = require('../db');
const dealTime = require('../tools/dealTime');
//添加漂流瓶（需要传入使用者，漂流瓶内容，漂流瓶类型）
exports.setbottle = (req, res) => {
    const bottelinfo = req.body;
    var date = new Date();
    bottelinfo.sendtime = dealTime.formatTime(date);//获取当前添加漂流瓶时间并初始化
    bottelinfo.isfind = 0;
    const sendsql = 'insert into drift_bottle SET ?';
    db.query(sendsql, bottelinfo, (err, result) => {
        if (err) {
            console.log('漂流瓶插入错误' + err.message);
            res.send({
                status: '100',
                message: '投放漂流瓶失败',
            })
        } else {
            if (result.affectedRows === 1) {
                res.send({
                    status: '200',
                    message: '投放漂流瓶成功',
                })
            }
        }
    })
}

//捞取漂流瓶（需要传入漂流瓶类型）(返回漂流瓶信息)
exports.getbottle = (req, res) => {
    const bottle_type = req.body.type;
    const succes_chance = Math.random() * 10;//成功捞取漂流瓶的概率
    const getbottlesql = 'select * from drift_bottle where type = ? && isfind = 0';//获取目标类型漂流瓶
    db.query(getbottlesql, bottle_type, (err, result) => {
        // console.log(result);
        if (result.length > 0) {//还存在传入类型的漂流瓶时
            const bottle_pos = Math.floor(Math.random() * result.length);//从目标类型的漂流瓶中随机选择一个
            const isfindsql = 'update drift_bottle set isfind = 1 where bottleid = ?';//修改漂流瓶是否捞取的bool值
            db.query(isfindsql, result[bottle_pos].bottleid, (err, res) => {
                if (err) console.log(err.message);
            })
            res.send({
                status: '200',
                message: '成功捞到一个漂流瓶',
                data: {
                    content: result[bottle_pos],
                }
            })
        } else {//传入类型漂流瓶捞完时
            res.send({
                status: '200',
                message: '可惜了，这次没有捞到~',
                data: [],
            })
        }
    })
}

//存入漂流瓶（需传入持有者用户名，漂流瓶id，漂流瓶内容,漂流瓶类型)部分与添加重复
exports.storebottle = (req, res) => {
    let ownerinfo = req.body;
    const storesql = 'insert into bottle_owner set ?';
    db.query(storesql, ownerinfo, (err, result) => {
        if (err) console.log(err.message + '漂流瓶存入失败');
        else {
            if (result.affectedRows === 1) {
                res.send({
                    status: '200',
                    message: '投放漂流瓶存入成功',
                })
            }
        }
    })
}

//查看自己丢的漂流瓶（传入用户名）（返回自己的漂流瓶信息）
exports.mybottle = (req, res) => {
    const user = req.body.user;
    const mybottlesql = 'select * from drift_bottle where user = ?';
    db.query(mybottlesql, user, (err, result) => {
        if (err) console.log(err.message);
        else {
            if (result.length > 0) {
                res.send({
                    status: '200',
                    message: '获取我的成功',
                    data: result,
                })
            }
            else {
                res.send({
                    status: '200',
                    message: '获取我的成功',
                    data: '你还没有投漂流瓶哟~',
                })
            }
        }
    })
}

//查看自己捞的漂流瓶(传入用户名)
exports.receivebottle = (req, res) => {
    const user = req.body.user;
    const getsql = 'select * from bottle_owner where owner = ?';
    const getsql2 = 'select user from drift_bottle where bottleid = ?';
    let mygetbottle=[];//存当前用户捞出漂流瓶数据
    db.query(getsql, user, async (err, result) => {
        if (err) console.log(err.message);
        else {
            for (let i = 0; i < result.length; i++) {
                const curres = await new Promise((resolve, reject) => {//用promise解决由于异步问题导致query外部获取不到其内部数据
                    db.query(getsql2, result[i].bottleid, (err, res2) => {
                        if (err) console.log(err.message);
                        else {
                            result[i].user = res2[0].user;
                            resolve(result[i]);
                        }
                    })
                })
                mygetbottle.push(curres);
            }
            res.send({
                status: 200,
                message: "request ok",
                data: mygetbottle,
            })
        }
    })
}

//丢回已捞取的漂流瓶（传入漂流瓶id)
exports.pushbottle = (req, res) => {
    const bottleid = req.body.bottleid;
    const pushsql = 'update drift_bottle set isfind = 0 where bottleid = ?';
    const delsql = 'delete from bottle_owner where bottleid = ?';
    db.query(pushsql, bottleid, (err, result) => {
        if (err) console.log(err.message);
        db.query(delsql,bottleid,(err,res)=>{//在捞取瓶子中删除
            if(res.affectedRows === 1){
            }
        })
    })
    res.send({
        status: '200',
        message: '已将漂流瓶扔回海里',
    })
} 


//回复漂流瓶(传入内容和漂流瓶id,用户名)
exports.answerbottle = (req, res) => {
    const answerinfo = req.body;
    const answersql = 'insert into bottle_answer set ? ';
    db.query(answersql, answerinfo, (err, result) => {
        if(err) console.log(err.message);
        if (result.affectedRows === 1) {
            res.send({
                status: '200',
                message: '漂流瓶回复成功',
            })
        }
    })
}

//获取漂流瓶回复(传入漂流瓶id)
exports.getbottleanswer = (req, res) => {
    let bottleid = req.body.bottleid;
    const getbottlecomment = 'select * from bottle_answer where bottleid = ?';//获取该漂流瓶回复内容
    let bottle_answer;//存漂流瓶回复
    db.query(getbottlecomment, bottleid, (err, this_res) => {
        if (err) console.log(err.message);
        else {
            bottle_answer = this_res;
            res.send({
                status: '200',
                message: '成功捞到一个漂流瓶',
                data: {
                    bottle_answer: bottle_answer,
                }
            })
        }
    })
}

  