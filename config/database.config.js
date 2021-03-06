const mongoose = require('mongoose');
const log = require('./log4js.config');

const URI = "mongodb+srv://admin:0412Gt98@sandboxcluster.1ywmx.mongodb.net/partyJoinerDB?retryWrites=true&w=majority"

const connectDatabase = async () => {
    await mongoose.connect(URI, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: true
    }, (err) => {
        if(err) console.log(err.message);
    });
    log.info('MongoDB successfully connected!')
}

module.exports = connectDatabase
