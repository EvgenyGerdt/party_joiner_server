const User = require('../models/User.model');

const ErrorResponse = require('../utils/errorResponse');
const { sendResponse } = require('../utils/successResponse');

const log = require('../config/log4js.config');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: 'partyjoiner.app@gmail.com',
        pass: 'Evgeny0412Gt98',
    },
    secure: true,
});

/**
 * @description {POST} Регистрация пользователя
 */
exports.register = async (req, res, next) => {
    const {username, email, password, secretWord} = req.body;
    try {
        User.findOne({ email: email }, async (err, user) => {
            if (err) {
                log.error(err.message);
                return next(new ErrorResponse(err.message, 500));
            } else if (user) {
                log.warn(`${user} already exists`);
                return next(new ErrorResponse('Пользователь с данным почтовым адресом уже существует', 400));
            } else {
                const user = await User.create({
                    username, email, password, secretWord
                });
                log.info(user);
                await sendResponse(user, 200, res);
            }
        })
    } catch (err) {
        log.error(err.message);
        return next(new ErrorResponse(err.message, 500));
    }
}

/**
 * @description {POST} Авторизация пользователя
 */
exports.login = async (req, res, next) => {
    const authCandidate = {
        username: req.body.username,
        password: req.body.password
    };

    if(!authCandidate.username || !authCandidate.password) {
        return next(new ErrorResponse("Please, provide an email and password", 400));
    }

    try {
        await User.findOne({ username: authCandidate.username }, async (err, user) => {
            if (err) {
                log.error(err.message);
                return next(new ErrorResponse(err.message, 500));
            } else if (!user) {
                log.warn(`${user} not found`);
                return next(new ErrorResponse('Invalid credentials', 404));
            } else {
                const isMatch = await user.matchPasswords(authCandidate.password);

                if(!isMatch) {
                    log.warn(`${user} invalid credentials`)
                    return next(new ErrorResponse('Invalid credentials', 404));
                } else {
                    await User.findOne({ username: authCandidate.username }, async (err, user) => {
                        if (err) {
                            log.error(err.message);
                            return next(new ErrorResponse(err.message, 500));
                        } else {
                            await sendResponse(user, 200, res);
                        }
                    })
                }
            }
        }).select("password");
    } catch (err) {
        log.error(err.message);
        return next(new ErrorResponse(err.message, 500));
    }
}

/**
 * @description {POST} Отправка кода для смены пароля
 */
exports.sendResetCode = async (req, res, next) => {
    const { to, username } = req.body;

    try {
        User.findOne({email: to}, async function (err, user) {
            if (err) {
                return next(new ErrorResponse(err.message, 500));
            } else if (!user) {
                return next(new ErrorResponse('Пользователь не найден', 404));
            } else {
                const resetCode = generateResetCode();
                await user.updateOne({resetPasswordCode: resetCode});

                const mailData = {
                  from: 'partyjoiner.app@gmail.com',
                  to: to,
                  subject: "Код восстановления пароля",
                  html: `<b>Привет, ${username}!</b><br>Код для восстановления пароля ${resetCode}</br>`,
                };

                await transporter.sendMail(mailData, async (err, info) => {
                    if (err) {
                        log.error(err.message);
                        return next(new ErrorResponse('Ошибка отправки письма', 500));
                    }
                    await sendResponse({message: "Письмо отправлено", message_id: info.messageId}, 200, res);
                });
            }
        })
    } catch (err) {
        return next(new ErrorResponse(err.message, 500));
    }
};

/**
 * @description {POST} Проверка кода для смены пароля
 */
exports.checkResetCode = async (req, res, next) => {
    const { code } = req.body;

    try {
        User.findOne({resetPasswordCode: code}, async function (err, user) {
            if (err) {
                return next(new ErrorResponse(err.message, 500));
            } else if (!user) {
                return next(new ErrorResponse("Пользователь не найден", 500));
            } else {
                await sendResponse({message: "Код подтвержден!"}, 200, res);
            }
        })
    } catch (err) {
        return next(new ErrorResponse(err.message, 500));
    }
}

/**
 * @description {POST} Смена пароля
 */
exports.resetPassword = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        User.findOne({email: email}, async function (err, user) {
            if (err) {
                return next(new ErrorResponse(err.message, 500));
            } else if (!user) {
                return next(new ErrorResponse("Пользователь не найден", 500));
            } else {
                await user.updateOne({ password: await user.getHashedPassword(password) });
                await sendResponse({message: `Password successfully changed for ${email}`}, 200, res);
            }
        })
    } catch (err) {
        return next(new ErrorResponse(err.message, 500));
    }
}

function generateResetCode() {
    return Math.random().toString(12).substring(2, 5) + Math.random().toString(12).substring(2, 5);
}