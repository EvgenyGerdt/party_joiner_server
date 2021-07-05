const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema

const SALT_ROUNDS = 10;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please, provide your username"],
        unique: true,
        maxlength: 50
    },
    password: {
        type: String,
        required: [true, "Please, provide your password"],
        unique: false,
        maxlength: 1024,
        minlength: 6,
        select: false
    },
    secretWord: {
        type: String,
        required: [true, 'Please, provide your secret word'],
        maxlength: 50,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }
});

UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.getHashedPassword = async function(password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
}

UserSchema.methods.matchPasswords = async function(password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.matchSecretWord = async function(secretCandidate, userSecretWord) {
    return secretCandidate === userSecretWord;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
