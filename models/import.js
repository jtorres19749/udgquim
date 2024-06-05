const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const importSchema = new Schema({
  idScript: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  script: Schema.Types.Mixed
}, { strict: false }
);


const importDetailSchema = new Schema({
  idScript: {
    type: String,
    required: true
  },
  datavalue: {
    type: String,
    required: true
  }
}
);


const importdata = mongoose.model('importdata', importSchema);
const importdetail =  mongoose.model('importdetail', importDetailSchema);
module.exports = {
  importdata,
  importdetail
}

