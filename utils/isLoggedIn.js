const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

async function isLoggedIn(req) {

    const token = req.cookies['x-auth-token'];
    
    if (token) {
        const decoded = jwt.verify(token, config.secret);
        const user = await User.findOne({ _id: decoded.userId });

        if (user) {
            return { loggedIn: true, username: user.username, userId: user._id };
        } else {
            return { loggedIn: false };
        }
    }

    return { loggedIn: false };

}



module.exports = isLoggedIn;