//let sha256 = new Sha256();

function cryptrand(n = 1024) {
    let res = bigInt(0);
    while (res.bitLength() <= n) {
        n = parseInt(n / 8);
        let array = new Uint8Array(n);
        window.crypto.getRandomValues(array);
        let arr = [];
        array.forEach(a => {
            arr.push(a);
        });
        res = bigInt.fromArray(arr, 10).mod(N);
    }
    return res;
}

function generateCreditionals(name, password) {
    s = cryptrand(64);              // Salt for the user
    x = bH(s, name, password);      // Private key
    v = g.emodPow(x, N);            // Password verifier
    return {salt: s.toString(16), verifier: v.toString(16)};
}

function register() {
    let User = {
        username: $("#inputUserame").val(),
        password: $("#inputPassword").val(),
        passwordConf: $("#inputConfirmPassword").val()
    };
    if (!$('form.form-signin')[0].checkValidity()) return;
    if (User.password !== User.passwordConf) {
        $("div#error").html("Passwords do not match.");
        $("div#error").fadeToggle("fast", "linear");
        return;
    }

    $.post("/register/create", {username: User.username, ...generateCreditionals(User.username, User.password)},
        function (data) {
            if (data.status !== 200) {
                $("div#error").html(data.message);
                $("div#error").fadeToggle("fast", "linear");
            } else {
                window.location = '/login';
            }
        }
    );
}

class Client {

    constructor() {
        let self = this;
        if (!$('form.form-signin')[0].checkValidity()) return;
        self.name = $("#inputUserame").val();
        self.A = bigInt();
        while (!self.A || self.A.mod(N).toString(10) === "0") {
            self.a = cryptrand();
            self.A = g.emodPow(self.a, N);
        }

        console.log('-> Client, name ' + self.name);
        console.log('-> Client, A ' + self.A.toString(16));

        $.post("/login/step1", {'username': self.name, 'valA': self.A.toString(16)},
            function (data) {
                console.log('<- Server, Salt ' + data.s);
                console.log('<- Server, B ' + data.B);
                self.s = bigInt(data.s, 16);
                self.B = bigInt(data.B, 16);
                self.authStep1Challenge();
                self.authStep2();
            }
        );
    }

    authStep1Challenge() {
        let self = this;
        if (self.B.mod(N) === bigInt(0)) {
            throw new Error("Server sent invalid key: B mod N == 0.");
        }

        let password = $("#inputPassword").val();

        let u = bH(self.A, self.B);
        let x = bH(self.s, self.name, password);

        let kgx = K.multiply(g.emodPow(x, N));
        let aux = self.a.add(u.multiply(x));

        let S = self.B.subtract(kgx).emodPow(aux, N);

        self.u = u;
        self.S = S;
        self.K = bH(S);


    }

    authStep2() {
        let self = this;

        let xor = bH(N).xor(bH(g));
        self.M = H(xor, bH(self.name), self.s, self.A, self.B, self.K);

        console.log('-> Client, name ' + self.name);
        console.log('-> Client, A ' + self.A.toString(16));
        console.log('-> Client, M: ' + self.M.toString(16));

        $.post("/login/step2", {'username': self.name, 'A': self.A.toString(16), 'M': self.M.toString(16)},
            function (data) {
                if (typeof data === 'object') {
                    if (data.error === 400) {
                        (function () {
                            let debug = {};
                            for (let key of Object.getOwnPropertyNames(self)) {
                                // use key / value here
                                let val = self[key];
                                debug[key] = bigInt.isInstance(val) ? val.toString(16) : val;
                            }
                            debug['salt'] = debug['s'];
                            delete debug.s;

                            let diff = {};
                            for (let key of Object.getOwnPropertyNames(debug)) {
                                // use key / value here
                                let val = debug[key];
                                if (typeof data.session[key] !== 'undefined' && val !== data.session[key])
                                    diff[key] = {Client: val, Server: data.session[key]};
                                else if (typeof data.session[key] === 'undefined')
                                    diff[key] = {Client: val};
                            }

                            for (let key of Object.getOwnPropertyNames(data.session)) {
                                // use key / value here
                                let val = data.session[key];
                                if (typeof debug[key] !== 'undefined' && val !== debug[key])
                                    diff[key] = {Client: debug[key], Server: val};
                                else if (typeof debug[key] === 'undefined')
                                    diff[key] = {Server: val};
                            }

                            console.log({Client: debug, Server: data.session, diff: diff});
                        })();
                    }

                    return;
                }
                console.log('<- Server, R ' + data);

                self.R = H(self.A, self.M, self.K);

                if (data === self.R) {
                    console.log('Client <-> Server connection established');
                }

            }
        );
    }
}