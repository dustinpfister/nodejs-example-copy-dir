let fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile),
stat = promisify(fs.stat),
readdir = promisify(fs.readdir),

copy = require('./copy.js').copy,
mkdirp = require('./mkdirp.js'),
log = require('./log.js')({
        modName: 'copydir.js'
    });

let copyDir = function (source, target) {

    source = path.resolve(source);
    target = path.resolve(target);

    log('making sure target folder ' + target + ' is there.', 'info');
    return mkdirp(target) // make sure target folder is there
    .then(() => { // read dir
        log('target folder good, reading source dir: ' + source, 'info');
        return readdir(source);
    })
    .then((items) => { // get dir stats
        log('reading stats for all items in source: ' + source, 'info');
        return Promise.all(items.map((itemName) => {
                let itemPath = path.join(source, itemName);
                return stat(itemPath)
                .then((stats) => {
                    return {
                        itemPath: itemPath,
                        itemName: itemName,
                        stats: stats
                    }
                });
            }));
    })
    .then((itemObjs) => { // copy files
        log('copying files', 'info');
        let files = itemObjs.filter((itemObj) => {
                return itemObj.stats.isFile();
            });
        return Promise.all(files.map((itemObj) => {
                return copy(itemObj.itemPath, path.join(target, itemObj.itemName));
            }))
        .then(() => {
            return itemObjs;
        });
    })
    .then((itemObjs) => { // copy folders
        log('copying folders for: ' + source, 'info');
        let folders = itemObjs.filter((itemObj) => {
                return itemObj.stats.isDirectory();
            });
        return Promise.all(folders.map((itemObj) => {
                return copyDir(itemObj.itemPath, path.join(target, itemObj.itemName));
            }));
    })
    .catch((e) => {
        log(e, 'error');
        return e;
    });

};

exports.copyDir = copyDir;
