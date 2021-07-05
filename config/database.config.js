const mongoose = require('mongoose');

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
    console.log('MongoDB successfully connected!')
}

module.exports = connectDatabase
