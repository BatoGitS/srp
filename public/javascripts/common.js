if (typeof module != 'undefined' && module.exports) {
    var bigInt = require('big-integer');
    var sha256 = require('./sha256');
}

// Paranoid mode
// const Nhex = "00:93:9e:45:65:e9:04:5b:95:17:69:67:fe:e8:4f:\
//                 a6:fd:e1:6a:3a:ad:7d:26:71:71:c8:01:53:59:fe:\
//                 49:29:d7:74:d3:7b:5b:25:4c:ef:1b:83:08:1f:da:\
//                 2d:9e:f6:cf:1a:88:f0:83:91:c4:79:10:fa:43:6c:\
//                 46:59:bc:e3:07:da:b6:49:79:f0:8e:61:99:25:37:\
//                 40:58:33:52:84:ea:ee:f0:a0:dd:be:06:08:2b:61:\
//                 ae:ab:3a:9e:b9:0f:8b:7e:08:4d:e8:40:2d:98:13:\
//                 2b:52:5a:23:70:21:61:06:e1:33:c0:4f:78:15:d1:\
//                 10:69:60:93:ea:bc:6c:38:24:3a:c5:d4:f7:bd:a8:\
//                 8d:6a:cb:77:3d:42:6c:c9:4c:26:a7:7e:af:29:67:\
//                 db:e1:da:87:54:ee:6e:a2:ca:9d:73:28:f1:97:3c:\
//                 0a:8f:0e:4a:74:2e:db:b4:a8:97:51:fe:b4:5a:74:\
//                 a8:fc:11:bd:1c:fb:19:13:68:21:11:75:3c:21:8e:\
//                 f2:65:80:ac:a5:71:34:30:6f:c2:05:87:9a:2a:03:\
//                 e1:04:6b:79:96:b3:41:5e:8c:27:1c:e7:0a:fa:35:\
//                 44:8a:cb:70:ff:23:19:9c:4d:f0:5b:9e:7f:cb:c4:\
//                 43:3e:5f:61:dd:af:bd:ee:4f:75:51:78:48:c1:12:\
//                 8b:f4:47:b4:ca:7e:6a:d7:fb:5f:86:dd:29:b7:a8:\
//                 57:24:f4:81:11:c5:c5:f6:9a:bd:2f:f4:40:8b:93:\
//                 89:9b:7b:ed:12:28:e7:d2:c4:03:bc:77:07:d0:d4:\
//                 ef:f1:4f:9a:6e:15:80:8a:33:6f:9f:dd:bf:a2:1b:\
//                 14:34:98:5d:72:84:ea:29:74:80:bd:46:f4:ee:98:\
//                 91:a8:cf:c9:6b:05:98:71:7f:08:a6:4a:5d:f0:75:\
//                 86:db:98:71:c6:d5:e6:c2:2d:8a:75:36:c9:60:c7:\
//                 75:3e:ef:78:67:73:ec:f8:d3:df:b0:e7:4b:92:5f:\
//                 14:72:95:98:b5:de:47:4c:da:e5:f5:1a:53:0c:17:\
//                 cf:c0:ec:78:b1:2b:0a:0c:16:db:26:aa:5e:dc:46:\
//                 b8:bf:ab:ff:3a:02:5c:50:ac:79:74:07:b5:8c:29:\
//                 74:c8:7f:cf:6e:6a:21:e1:ad:51:42:3f:d5:64:de:\
//                 66:7e:c3:c2:3d:1c:8d:fa:81:12:75:d0:fb:63:12:\
//                 8e:d5:88:34:58:9f:76:b1:77:8f:b1:be:db:e2:0d:\
//                 aa:2d:6c:19:6d:b7:78:25:71:41:db:65:aa:22:47:\
//                 04:02:a8:6d:f4:d7:fb:28:2b:62:57:f2:ed:2a:8f:\
//                 8d:8a:3d:4c:2b:c6:72:d4:46:4d:d3:dd:53:96:85:\
//                 97:af:31";
// const Ghex = "00:86:7c:00:66:9b:f5:92:9b:48:ea:1f:f2:a2:f6:\
//                 4e:47:8a:59:a6:4d:ca:0f:23:df:c3:a2:90:d2:ad:\
//                 63:ee:a4:51:a7:f8:c0:54:06:0b:c9:3b:2d:82:5c:\
//                 ca:36:35:11:53:e2:57:23:00:18:26:8c:85:bb:7d:\
//                 cf:2b:1d:cc:29:32:31:4a:bd:58:d1:93:f3:f5:b2:\
//                 df:fa:13:47:5f:1d:f7:88:a7:ca:69:b5:3e:d7:2d:\
//                 5f:08:59:56:22:a0:d1:4f:f6:df:2a:df:d2:bf:4d:\
//                 cb:9c:75:22:7e:c3:2d:60:bc:e1:56:5c:b6:a2:f6:\
//                 62:6f:50:7e:06:5d:50:70:86:cf:26:69:c9:0d:51:\
//                 af:90:6d:c1:55:04:c1:1e:d6:98:a8:99:ec:8e:81:\
//                 c1:02:9b:71:f8:2e:9e:fe:fa:3c:3f:74:0a:45:53:\
//                 cb:bf:b7:66:07:c1:4a:fb:02:a8:72:12:ed:95:2c:\
//                 9a:a8:6f:a4:9f:9a:e4:7d:f7:c9:ad:29:49:77:01:\
//                 a0:c9:ea:62:33:50:be:d9:9a:92:c7:b9:53:d3:f2:\
//                 e9:e0:c3:f9:4e:b6:09:f9:79:51:c1:0e:15:cf:ca:\
//                 d1:23:bd:1d:c2:6e:3f:eb:cf:5d:41:fb:08:07:9a:\
//                 7f:68:7c:00:1c:ac:28:6f:6b:46:8b:2b:53:43:98:\
//                 fc:4b:d5:dc:d3:9f:bd:7b:61:f1:06:e4:24:6f:73:\
//                 b3:bb:2d:d3:56:ad:99:f3:5e:18:e2:1b:7c:39:bc:\
//                 bb:92:01:63:8d:50:f0:9e:42:ea:a1:bf:3f:40:32:\
//                 17:69:ad:44:7d:43:65:10:f1:99:7d:63:11:c3:5f:\
//                 12:58:04:6e:58:2f:e0:52:9e:f1:f8:17:d8:52:db:\
//                 ca:6f:b9:3d:3e:1b:71:d7:40:78:5f:fc:75:d2:12:\
//                 8a:79:0d:0c:80:1b:6d:b5:60:88:2b:ab:73:ff:b7:\
//                 7b:7e:c1:18:c7:83:9a:91:55:da:49:db:30:ad:f4:\
//                 b5:60:24:5b:ef:0a:c6:75:18:9b:c3:0d:96:6c:09:\
//                 9d:ac:e1:37:8a:51:62:aa:1f:00:ee:8e:eb:c9:33:\
//                 a1:fe:d0:3f:86:66:16:83:62:c2:36:ce:7f:ee:dd:\
//                 b7:56:30:c2:cc:c8:38:5b:9a:34:ed:ef:d1:f4:36:\
//                 d7:e8:e3:8a:15:f8:ac:90:2d:04:07:c4:a8:61:22:\
//                 45:69:98:23:46:e9:c8:b3:80:7a:c5:b0:0a:8d:0a:\
//                 e9:5b:32:21:b6:eb:93:2d:ce:9a:e8:4b:c7:53:35:\
//                 cb:08:6d:75:1a:eb:80:bd:ba:89:f0:20:ce:ab:5e:\
//                 a8:a6:dd:d0:18:51:a1:c0:4a:21:c7:6e:98:bd:7e:\
//                 bd:cc:9d";
//
// const N = bigInt(Nhex.replace(/[\s+:]/g, ''), 16);
// const g = bigInt(Ghex.replace(/[\s+:]/g, ''), 16);
// const K = bH(N, g);

// Carefully copied from openssl output by specially trained nekos
// openssl dhparam -text 1024 -2
const Nhex = "00:f5:0a:08:ad:ff:22:47:58:12:37:db:d3:e8:fc:\
            84:4a:f9:50:fb:7c:34:fc:c1:73:29:fa:15:e1:ee:\
            15:ae:a9:3f:bb:23:bb:d3:88:22:cc:44:cb:a3:28:\
            dc:db:19:b2:fa:b3:72:f9:f9:8a:05:f7:16:4a:39:\
            90:19:d4:ee:ae:cd:c7:38:ee:19:22:61:0f:00:91:\
            6b:0c:23:18:e5:05:fb:7d:34:4d:fe:22:7e:92:59:\
            3d:6f:c1:91:d0:1f:37:b8:41:65:2f:76:54:8f:ab:\
            e0:19:93:b3:a6:13:c8:c3:50:2a:5d:13:52:61:8c:\
            6c:e2:90:14:41:66:8b:61:5b";

const N = bigInt(Nhex.replace(/[\s+:]/g, ''), 16);
const g = bigInt(2);
const K = bH(N, g);


bigInt.prototype.emodPow = function (exp, mod) {
    let x = this.modPow(exp, mod);
    return x.isNegative() ? x.add(mod) : x;
};

function H() {

    [...arguments].forEach(function (part, index, theArray) {
        if (bigInt.isInstance(theArray[index])) {
            theArray[index] = theArray[index].toString(16);
        }
    });
    let ret = "";
    if (typeof module != 'undefined' && module.exports) {
        ret = sha256.hash([...arguments].join(':'));
    } else {

        ret = new Sha256().constructor.hash([...arguments].join(':'))
    }
    return ret.replace(/^0+/, '');
}

function bH() {
    return bigInt(H.apply(null, arguments), 16);
}

if (typeof module != 'undefined' && module.exports) module.exports = {N, g, H, bH, K, bigInt};
