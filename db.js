const mongoose = require('mongoose');
const config = require("./config");

/*******
 * Server, database and socket.io connected
 **********************/
const connectDB = async () => {
    try {
        await mongoose.connect(config.db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("MONGODB CONNECTED");
    } catch (err) {
        console.log("database error", err);
        process.exit(1);
    }
};

module.exports = connectDB;