let colors = {
    normal: '\u001b[37m',
    info: '\u001b[36m',
    success: '\u001b[32m',
    error: '\u001b[31m',
    reset: '\u001b[0m'
};
module.exports = (opt) => {

    opt = opt || {};
    opt.modName = opt.modName || false;
    opt.EOL = opt.EOL || '\n';

    return (data, type) => {
        type = type === undefined ? 'normal' : type;
        process.stdout.write(colors[type]);
        if (opt.modName) {
            process.stdout.write(opt.modName + ': ');
        }
        process.stdout.write(data + opt.EOL);
        process.stdout.write(colors.reset);
    };

};
