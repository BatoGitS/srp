var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('register', {title: 'SRP Register page'});
});

router.post('/create', function (req, res, next) {
    let [name, salt, verifier] = [req.body.username, req.body.salt, req.body.verifier];
    let reg = userlist.addUser(new User(name, salt, verifier));
    if (reg)
        res.send({status: 400, message: reg});
    else
        res.send({status: 200, message: ''});
});

module.exports = router;
