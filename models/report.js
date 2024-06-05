const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    title: {
      type: String,
      required: false
    },
    subtitle: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: false
    },
    updatable: {
      type: Boolean,
      required: false
    },
    url: {
      type: String,
      required: false,
      default: false
    }, 
    collectionname: {
      type: String,
      required: false,
    }, 
    actions: [
      {
        type: {
          type: String,
          required: false,
        }, 
        action: {
          type: String,
          required: false,
        }, 
        url: {
          type: String,
          required: false,
        }, 
        type: {
          type: String,
          required: false,
        }, 
        format: {
          type: String,
          required: false,
        }, 
        target: {
          type: String,
          required: false,
        }
      } 
    ]
    
});

module.exports = mongoose.model('Report', reportSchema);
