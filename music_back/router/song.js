
const express = require('express');
const router = express.Router();
const song = require('../router_handle/song');

//路由挂载
router.post('/setcomment', song.setcomment);
router.post('/getcomment', song.getcomment);
router.post('/delcomment', song.delcomment);
router.post('/addcollect', song.addcollect);
router.post('/getcollect', song.getcollect);
router.post('/delcollect', song.delcollect);
module.exports = router;