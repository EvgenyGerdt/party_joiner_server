const express = require('express')
const router = express.Router()

const {
    createParty,
    joinUserInParty,
    findUserPartyList,
    closePartyRoom
} = require('../controllers/rooms.controller')

router.route('/create_party').post(createParty);

router.route('/join_party').post(joinUserInParty);

router.route('/get_party_list').post(findUserPartyList);

router.route('/close_party').post(closePartyRoom);

module.exports = router;
