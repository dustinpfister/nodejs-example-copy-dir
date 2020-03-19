let fs = require('fs'),
path = require('path');

let mkdirp = (p, cb) => {
    p = path.resolve(p);
    fs.mkdir(p, (e) => {
        if (!e) {
            cb(null);
        } else {
            if (e.code === 'ENOENT') {
                // if 'ENOENT' code error call mkdirp
                // again with the dirname of current dir
                mkdirp(path.dirname(p), (e) => {
                    if (e) {
                        cb(e);
                    } else {
                        mkdirp(p, cb);
                    }
                });
            } else {
                // else some other error happened
                if(e.code === 'EEXIST'){ // if folder is there we are good
                    cb(null);
                }else{
                    cb(e);
                }
            }
        }
    });
};

module.exports = (p) => {
    return new Promise((resolve, reject)=>{
        mkdirp(p, (e) => {
            if(e){
                reject(e);
            }else{
                resolve();
            }
        });
    });
};