const jwt = require('jsonwebtoken');
const config = require('../config/config');


function createToken(userId) {
   const token = jwt.sign({userId}, config.secret, {expiresIn: '2d'});
   return token;
}

module.exports = createToken;