let bigInt = require("big-integer");

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
};

class User {
    constructor(name, salt, verifier) {
        this.name = name;
        this.salt = bigInt(salt, 16);
        this.verifier = bigInt(verifier, 16);
        this.sessions = {};
    }

    session(strA) {
        if (typeof this.sessions[strA] === 'undefined') {
            this.sessions[strA] = {'A': bigInt(strA, 16), expiredAt: Date.now()};
        }
        return this.sessions[strA];
    }
}

class Users {
    constructor() {
        this.users = {};
    }

    getUser(name) {
        return this.users[name];
    }

    userExist(name) {
        if (typeof this.users[name] === 'undefined') {
            return false;
        }
        return true;
    }

    addUser(user) {
        if (!this.userExist(user.name)) {
            this.users[user.name] = user;
            return false;
        } else {
            return 'Username already exist';
        }
    }

    flushExpiredSessions() {
        this.users.forEach(function (user) {
            let toDel = [];
            let u = this.users[user];
            u.sessions.forEach(function (session) {
                if (u.sessions[session].expiredAt.addHours(3) < Date.now()) toDel.push(session)
            });

            toDel.forEach(function (value) {
                delete u.sessions[value];
            })
        });
    }

}

global.userlist = new Users();

module.exports = User;