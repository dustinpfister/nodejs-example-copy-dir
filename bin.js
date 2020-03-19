let copyDir = require('./lib/copydir.js').copyDir,
log = require('./lib/log.js')({
        modName: 'bin.js'
    });

let source = process.argv[2],
target = process.argv[3];

if (source && target) {
    log('starting copy of ' + source + ' to ' + target, 'info');
    copyDir(source, target)
    .then(() => {
        log('done', 'success');
    })
    .catch((e) => {
        log(e, 'error');
    });
} else {
    log('must give a source and target folder', 'info');
}
