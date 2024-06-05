const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const log = new Schema({
  tipo: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: false
  },
  datos: {
    type: String,
    required: false
  },
  fecha: { 
    type : Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('log', log);
