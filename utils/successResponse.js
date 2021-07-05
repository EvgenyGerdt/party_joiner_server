exports.sendResponse = async function (data, statusCode, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(statusCode).json({success: true, data: data});
}
