const User = require('../models/User.model');

const ErrorResponse = require('../utils/errorResponse');
const { sendResponse } = require('../utils/successResponse');

const log = require('../config/log4js.config');

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
      User.findById({ _id: id }, async (err, user) => {
          if (err) {
              log.error(err.message);
              return next(new ErrorResponse(err.message, 500));
          } else if (!user) {
              log.error(`USER WITH ID ${id} NOT FOUND`, 404);
              return next(new ErrorResponse('User not found', 404));
          } else {
              await sendResponse(user, 200, res);
          }
      })
  } catch (e) {
      log.error(e.message);
      return next(new ErrorResponse(e.message, 500));
  }
};
