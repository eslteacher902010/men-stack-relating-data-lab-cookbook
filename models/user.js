const mongoose = require('mongoose');

// user.js---nesting?

const foodSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true
  }
});


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pantry: [foodSchema]
});


const User = mongoose.model('User', userSchema);



module.exports = User;
