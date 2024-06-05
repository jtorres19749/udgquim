const mongoose = require('mongoose');
const Carrera  = require('./carrera.js');

const Schema = mongoose.Schema;

const settingSchema = new Schema({
  actualSemester: {
    type: String,
    required: false
  },
  lastSemester: {
    type: String,
    required: false
  },
  allsemesters: {
    type: String,
    required: false
  },
  importbatchsize: {
    type: Number,
    required: false,
    default: 50
  },
  fecActualizacion : { type : Date, default: Date.now },
});

settingSchema.pre('save', function (next) {
  this.fecActualizacion = Date.now();
  next();
 });

module.exports = mongoose.model('setting', settingSchema);
