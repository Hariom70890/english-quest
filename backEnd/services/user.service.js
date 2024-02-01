const User = require('../Model/user.model');

const createUser = (user) => {
    return User(user);
}

const getUserByEmail = (email) => {
    return User.findOne({email});
}

module.exports = {
    createUser,
    getUserByEmail
}