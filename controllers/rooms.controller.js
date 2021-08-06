const PartyRoom = require('../models/PartyRoom.model');

const ErrorResponse = require('../utils/errorResponse');
const { sendResponse } = require('../utils/successResponse');
const log = require('../config/log4js.config');

// POST Create party
exports.createParty = async (req, res, next) => {
    const { id, name, willHappenAt, location,
        description, creatorId, partyStatus} = req.body;

    try {
        PartyRoom.findOne({ id: id }, async (err, party) => {
            if (err) {
                return next(new ErrorResponse(err.message, 500));
            } else if (party) {
                return next(new ErrorResponse('Party code duplicated', 500));
            } else {
                const party = await PartyRoom.create({
                    id: id,
                    members: [creatorId],
                    name: name,
                    willHappenAt: willHappenAt,
                    location: location,
                    description: description,
                    creatorId: creatorId,
                    partyStatus: partyStatus
                });
                await sendResponse(party, 200, res);
            }
        })
    } catch (err) {
        return next(new ErrorResponse(err.message, 500));
    }
};

// POST Join in party
exports.joinUserInParty = async (req, res, next) => {
    const { userId, partyId } = req.body;

    try {
        PartyRoom.findOne({ id: partyId }, async (err, party) => {
            if (err) {
                return next(new ErrorResponse(err.message, 500));
            } else if (!party) {
                return next(new ErrorResponse('Invalid party code', 404));
            } else {
                PartyRoom.findOne({ id: partyId, members: userId }, async (err, member) => {
                   if (err) {
                       log.error(err.message);
                       return next(new ErrorResponse(err.message, 500));
                   }  else if (member) {
                       log.warn('You already in party');
                       return next(new ErrorResponse('You already in party', 400));
                   } else {
                       const updateMembers = {
                           $push: {"members": userId}
                       };
                       await PartyRoom.update(updateMembers);
                       await sendResponse(party, 200, res);
                   }
                });
            }
        })
    } catch (err) {
        log.error(err.message);
        return next(new ErrorResponse(err.message, 500));
    }
}

// GET USER PARTY LIST
exports.findUserPartyList = async (req, res, next) => {
    const { id } = req.body;

    try {
        PartyRoom.find({ members: [id]}, async (err, partyList) => {
            if (err) {
                log.error(err.message);
                return next(new ErrorResponse(err.message, 500));
            } else if (!partyList) {
                log.warn('Party list is empty');
                return next(new ErrorResponse('Party list is empty', 404));
            } else {
                await sendResponse(partyList, 200, res);
            }
        })
    } catch (err) {
        log.error(err.message);
        return next(new ErrorResponse(err.message, 500));
    }
}

exports.closePartyRoom = async (req, res, next) => {
    const { partyId } = req.body;

    try {
        PartyRoom.findOne({ id: partyId }, async (err, partyRoom) => {
            if (err) {
                log.error(err.message);
                return next(new ErrorResponse(err.message, 500));
            } else if (!partyRoom) {
                log.warn('Party room not found');
                return next(new ErrorResponse('Party room not found', 404));
            } else {
                await PartyRoom.update({ partyStatus: false });
                await sendResponse(partyRoom, 200, res);
            }
        })
    } catch (err) {
        log.error(err.message);
        return next(new ErrorResponse(err.message, 500));
    }
}
