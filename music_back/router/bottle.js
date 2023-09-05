
const express = require('express');
const router = express.Router();
const bottle = require('../router_handle/bottle');

//路由挂载
router.post('/setbottle',bottle.setbottle);
router.post('/getbottle',bottle.getbottle);
router.post('/mybottle',bottle.mybottle);
router.post('/pushbottle',bottle.pushbottle);
router.post('/answerbottle',bottle.answerbottle);
router.post('/getbottleanswer',bottle.getbottleanswer);
router.post('/storebottle',bottle.storebottle);
router.post('/receivebottle',bottle.receivebottle);

module.exports = router;