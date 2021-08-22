const express = require('express');
const router = express.Router();

const {
    register,
    login,
    sendResetCode,
    checkResetCode,
    resetPassword,
} = require('../controllers/auth.controller');

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/send_code').post(sendResetCode);

router.route('/reset_password').post(resetPassword);

router.route('/check_code').post(checkResetCode);

module.exports = router;
