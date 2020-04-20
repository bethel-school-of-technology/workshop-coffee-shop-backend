const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authService = {
  signUser: function(user) {
    const token = jwt.sign(
      {
        username: user.username,
        uid: user._id
      },
      'dkfjghlsdfkjghlsdkfjgodfgdf554566572457fdg',
      {
        expiresIn: '1h'
      }
    );
    return token;
  },
  verifyUser: function (token) {
      
    try {
      let decoded = jwt.verify(token, 'dkfjghlsdfkjghlsdkfjgodfgdf554566572457fdg');
      console.log(decoded)
      return User.findById(decoded.uid); 
    } catch (err) {
      console.log(err);
      return null
    }
  },
  hashPassword: function(plainTextPassword) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(plainTextPassword, salt);
    return hash;
  },
  comparePasswords: function (plainTextPassword, hashedPassword) {
    return bcrypt.compareSync(plainTextPassword, hashedPassword)
  }
}

module.exports = authService;