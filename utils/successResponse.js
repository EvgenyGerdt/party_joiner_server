const log = require('../config/log4js.config');

exports.sendResponse = async function (data, statusCode, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(statusCode).json(data);
    log.info(`${data}`)
}
