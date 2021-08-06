/**
 * @description Генерирует ответ ошибки сервера
 * @param {string} message
 * @param {Number} statusCode
 * @return Express.Response
 */
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;
