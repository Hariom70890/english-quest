const mongoose = require("mongoose");
require("dotenv").config();

const USER_ROLES = {
    CREATOR: "CREATOR",
    VIEWER: "VIEWER",
    VIEW_ALL: "VIEW_ALL"
}

// connection
const connection = mongoose.connect(process.env.MONGO_URL);

module.exports = { connection, USER_ROLES };