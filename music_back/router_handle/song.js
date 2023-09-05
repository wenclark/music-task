const db = require('../db');
const dealTime = require('../tools/dealTime');

//歌曲评论（需要传入歌曲id,歌曲评论，评论者）
exports.setcomment = (req, res) => {
    const commentinfo = req.body;
    var date = new Date();
    commentinfo.comment_time = dealTime.formatTime(date);//获取当前评论时间并初始化
    // console.log(commentinfo.comment_time);
    const str = 'insert into comments SET ?'
    db.query(str, commentinfo, (err, result) => {
        if (err) {
            console.log(err.message);
        }
        if (result.affectedRows === 1) {
            res.send({
                status: '200',
                message: '评论成功',
            })
        }
    })

}
//获取歌曲评论（需要传入歌曲id）
exports.getcomment = (req, res) => {
    const songid = req.body.songid;
    const getstr = 'select * from comments where songid= ?';
    const getavator = 'select pic from users where username = ?';
    let newcommentarr = [];
    db.query(getstr, songid, async (err, result) => {
        if (err) console.log(err.message);
        else {
            for (let i = 0; i < result.length; i++) {
                const curres = await new Promise((resolve, reject) => {//用promise解决由于异步问题导致query外部获取不到其内部数据
                    db.query(getavator, result[i].username, (err, res2) => {
                        if (err) console.log(err.message);
                        else {
                            result[i].pic = res2[0].pic;//需要给每条数据添加pic属性
                            resolve(result[i]);
                        }
                    })
                })
                newcommentarr.push(curres);
            }
            res.send({
                status: '200',
                message: 'ok',
                data: newcommentarr,
            });
        }
    })
}
//删除个人评论(需要传入用户名,评论id)
exports.delcomment = (req, res) => {
    const delinfo = req.body;
    const selectusername = 'select username from comments where id=?';
    db.query(selectusername, delinfo.id, (err, result) => {
        if (err) {
            console.log('删除评论出错');
        }
        if (result[0].username != delinfo.username) {
            res.send('不能删除别人评论');
        }
        else {
            const delcom = 'delete from comments where id=?';
            db.query(delcom, delinfo.id, (err, result) => {
                if (result.affectedRows === 1) {
                    res.send({
                        status: '200',
                        message: 'delete ok',
                    })
                }
            })
        }
    })

}
//收藏歌曲（需传入歌曲id，用户名,歌名，作者）
exports.addcollect = (req, res) => {
    // let {username,songid} =req.body;
    let addsql = 'insert into collectsong set ?';
    db.query(addsql, req.body, (err, result) => {
        if (err) console.log(err.message);
        else {
            if (result.affectedRows === 1) {
                res.send({
                    status: '200',
                    message: 'insert ok!',
                })
            }
        }
    })

}
//取消收藏（需传入歌曲id，用户名）
exports.delcollect = (req, res) => {
    let { username, songid } = req.body;
    let deletsql = `delete from collectsong where songid = ${songid} and username = '${username}'`;
    // console.log(deletsql);
    db.query(deletsql,(err, result) => {
        if (err) {
            console.log(err.message);
        }
        else {
            if (result.affectedRows === 1) {
                res.send({
                    status: '200',
                    data: '删除成功'
                })
            }
        }
    })
}
//获取收藏歌曲（需传入用户名）
exports.getcollect = (req, res) => {
    let username = req.body.username;
    let getcollectsql = 'select * from collectsong where username = ?';
    db.query(getcollectsql, username, (err, result) => {
        if (err) {
            console.log(err.message);
        }
        else {
            res.send({
                status: '200',
                message: 'request ok!',
                data: result,
            })
        }
    })
}