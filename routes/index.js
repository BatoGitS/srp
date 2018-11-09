var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(userlist);
    res.render('index', {title: 'Express'});
});
router.get('/exp', function (req, res, next) {
    userlist.flushExpiredSessions();
});

module.exports = router;
