const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: false
    },
    password: {
      type: String,
      required: false
    },
    admin: {
      type: Boolean,
      required: false,
      default: false
    }, 
    tmpid: {
      type: String,
      required: false,
      default: ''
    }

});



module.exports = mongoose.model('User', userSchema);
