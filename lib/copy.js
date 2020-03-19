let fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile),
log = require('./log.js')({
        modName: 'copy.js'
    });

let copy = function (source, target) {
    source = path.resolve(source);
    target = path.resolve(target);
    return readFile(source)
    .then((data) => {
        return writeFile(target, data);
    })
    .then(() => {
        log(source + ' > ' + target, 'success');
    })
    .catch((e) => {
        log(e, 'error');
    });
};

exports.copy = copy;
