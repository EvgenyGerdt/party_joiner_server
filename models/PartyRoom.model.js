const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PartyRoomSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: [true, 'Please, provide party ID']
    },
    members: {
        type: Array,
        default: []
    },
    name: {
        type: String,
        required: [true, 'Please, provide party name'],
        maxlength: 255
    },
    willHappenAt: {
        type: Date,
        required: [true, 'Please, provide party Date']
    },
    location: {
        type: String,
        required: [true, 'Please, provide party location']
    },
    description: {
        type: String,
        required: false,
        maxlength: 1024
    },
    creatorId: {
        type: String,
        required: true
    },
    partyStatus: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

const PartyRoom = mongoose.model('PartyRoom', PartyRoomSchema);

module.exports = PartyRoom;
