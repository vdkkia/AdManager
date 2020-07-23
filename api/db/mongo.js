const mongoose = require('mongoose');
const config = require("config");

const mongoURI = process.env.MONGO_URI || config.get("MONGO_URI");
mongoose.Promise = global.Promise;

module.exports = { connect() {
    return mongoose.connect(mongoURI,{ useNewUrlParser: true });
} 
}
