let express = require('express');
let {N, g, H, bH, K, bigInt} = require('../public/javascripts/common');
let crypto = require('crypto');
let router = express.Router();


function cryptrand(n = 1024) {
    let res = bigInt(0);
    while (res.bitLength() <= n) {
        n = parseInt(n / 8);
        let array = new Uint8Array(n);
        crypto.randomFillSync(array);
        let arr = [];
        array.forEach(a => {
            arr.push(a);
        });
        res = bigInt.fromArray(arr, 10).mod(N);
    }
    return res;
}


/* GET home page. */
//
router.get('/', function (req, res, next) {
    res.render('login', {title: 'SRP Login page'});
});


router.post('/step1', function (req, res) {
    if (!userlist.userExist(req.body.username)) {
        res.send({error: 401, msg: 'Unknown user'});
        return;
    }
    let strA = req.body.valA;
    let A = bigInt(strA, 16);

    let User = userlist.getUser(req.body.username);
    let session = User.session(strA);

    session.B;
    session.b;
    while (!session.B || session.B.mod(N).toString(10) === "0") {
        session.b = cryptrand();
        let gbN = g.emodPow(session.b, N);
        let kv = K.multiply(User.verifier);
        session.B = gbN.plus(kv).mod(N);
    }

    session.u = bH(session.A, session.B);

    if (session.u.mod(N).toString(10) === "0") {
        console.error("Server got invalid key: u mod N == 0.");
    }
    if (User.verifier.mod(N).toString(10) === "0") {
        console.error("Server got invalid key: v mod N == 0.");
    }

    let avu = A.multiply(User.verifier.emodPow(session.u, N));

    session.S = avu.emodPow(session.b, N);
    session.K = bH(session.S);

    res.send({'s': User.salt.toString(16), 'B': session.B.toString(16)});

});

router.post('/step2', function (req, res) {
    if (!userlist.userExist(req.body.username)) {
        res.send({error: 401, msg: 'Unknown user'});
        return;
    }

    let valA = req.body.A;

    let User = userlist.getUser(req.body.username);
    let session = User.session(valA);

    let xor = bH(N).xor(bH(g));
    let M = H(xor, bH(User.name), User.salt, session.A, session.B, session.K);

    session.M = M;
    if (M !== req.body.M) {
        let debug = {};
        for (let key of Object.getOwnPropertyNames(session)) {
            let val = session[key];
            debug[key] = bigInt.isInstance(val) ? val.toString(16) : val;
        }
        for (let key of Object.getOwnPropertyNames(User)) {
            let val = User[key];
            debug[key] = bigInt.isInstance(val) ? val.toString(16) : val;
        }
        delete debug.sessions;
        res.send({error: 400, 'session': debug});
        delete User.sessions[valA];
        return;
    }

    let R = H(session.A, M, session.K);
    res.send(R);
});


module.exports = router;
