const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scriptSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  dataCollection: {
    type: String,
    required: false
  },
  script: Schema.Types.Mixed
}, { strict: false }
);


module.exports = mongoose.model('script', scriptSchema);
