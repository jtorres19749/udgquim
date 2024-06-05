const mongoose = require('mongoose');
const Carrera  = require('./carrera.js');

const Schema = mongoose.Schema;

const estudianteSchema = new Schema({
  codigo: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  correoInstitucional: {
    type: String,
    required: false
  },
  correo: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  carreras: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Carrera'  
    }
  ],
  actualizadoPorFicha: {
    type: String,
    required: false
  },
  actualizadoPorConstancia: {
    type: String,
    required: false
  },
  actualizadoPorKardex: {
    type: String,
    required: false
  },
  actualizadoPorSGRACAD: {
    type: String,
    required: false
  },
  fecActualizacion : { type : Date, default: Date.now },
});

estudianteSchema.pre('save', function (next) {
  this.fecActualizacion = Date.now();
  next();
 });

module.exports = mongoose.model('estudiante', estudianteSchema);
