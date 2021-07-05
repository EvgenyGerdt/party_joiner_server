const User = require('../models/User.model');

const ErrorResponse = require('../utils/errorResponse');
const { sendResponse } = require('../utils/successResponse');

// POST Registration
exports.register = async (req, res, next) => {
    const {username, password, secretWord} = req.body;
    try {
        User.findOne({ username: username }, async (err, user) => {
            if (err) {
                return next(new ErrorResponse(err.message, 500));
            } else if (user) {
                return next(new ErrorResponse('User already exists', 400));
            } else {
                const user = await User.create({
                    username, password, secretWord
                });
                await sendResponse(user, 200, res);
            }
        })
    } catch (err) {
        return next(new ErrorResponse(err.message, 500));
    }
}

// POST Login
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
                return next(new ErrorResponse(err.message, 500));
            } else if (!user) {
                return next(new ErrorResponse('Invalid credentials', 404));
            } else {
                const isMatch = await user.matchPasswords(authCandidate.password);

                if(!isMatch) {
                    return next(new ErrorResponse('Invalid credentials', 404));
                } else {
                    await sendResponse(user, 200, res);
                }
            }
        })
    } catch (err) {
        return next(new ErrorResponse(err.message, 500));
    }
}

// POST Reset user password
exports.resetPassword = async (req, res, next) => {
    const { username, newPassword, secretWord } = req.body;

    try {
        User.findOne({username: username}, async function (err, user) {
            if (err) {
                return next(new ErrorResponse(err.message, 500));
            } else if (!user) {
                return next(new ErrorResponse(err.message, 500));
            } else {
                const isSecretWordMatch = user.matchSecretWord(secretWord, user.secretWord);
                if(!isSecretWordMatch) {
                    return next(new ErrorResponse('Invalid secret word', 400));
                } else {
                    await user.updateOne({ password: await user.getHashedPassword(newPassword) });
                    await sendResponse(user, 200, res);
                }
            }
        })
    } catch (err) {
        return next(new ErrorResponse(err.message, 500));
    }
}
