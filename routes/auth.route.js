const express = require('express');
const router = express.Router();

const {
    register,
    login,
    resetPassword
} = require('../controllers/auth.controller');

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/reset_password').post(resetPassword);

module.exports = router;
