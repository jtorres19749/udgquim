const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const degreeSchema = new Schema({
  codigo: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  admision: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  nivel: {
    type: String,
    required: false
  },
  situacion: {
    type: String,
    required: false
  },
  ciclos: {
    type: Number,
    required: false
  },
  ultimoCiclo: {
    type: String,
    required: false
  },
  carrera: {
    type: String,
    required: false
  },
  centro: {
    type: String,
    required: false
  },
  sede: {
    type: String,
    required: false
  },
  creditos: {
    type: Number,
    required: false
  },
  fecha: {
    type: String,
    required: false
  },
  promedio: {
    type: Number,
    required: false
  },
  correoInstitucional: {
    type: String,
    required: false
  },
  creditosMaximos: {
    type: Number,
    required: false
  },
  creditosMinimos: {
    type: Number,
    required: false
  },
  creditosFaltantes: {
    type: Number,
    required: false
  },
  creditosRequeridosDelPrograma: {
    type: Number,
    required: false
  },
  porcentajeEnCreditos: {
    type: String,
    required: false
  },
  creditosAreaBasicoRequeridos: {
    type: Number,
    required: false
  },
  creditosAreaBasicoAdquiridos: {
    type: Number,
    required: false
  },
  creditosAreaEspecializanteRequeridos: {
    type: Number,
    required: false
  },
  creditosAreaEspecializanteAdquiridos: {
    type: Number,
    required: false
  },
  creditosAreaFormacionRequeridos: {
    type: Number,
    required: false
  },
  creditosAreaFormacionAdquiridos: {
    type: Number,
    required: false
  },
  creditosAreaOptativaRequeridos: {
    type: Number,
    required: false
  },
  creditosAreaOptativaAdquiridos: {
    type: Number,
    required: false
  },
  fecActualizacion : { type : Date, default: Date.now },
  actualiza: {
    type: Number,
    required: false
  },
  estudiantedetalle : {
    type: Schema.Types.ObjectId,
    ref: 'estudiante'  
  },
  listaciclos: [{
    ciclo: { 
      type: String, 
      required: false
    },
    admision: { 
      type: String, 
      required: false
    },
    centro: { 
      type: String, 
      required: false
    },
    sede: { 
      type: String, 
      required: false
    },
    promedio: {
      type: Number,
      required: false
    },
    creditos: { 
      type: Number, 
      required: false
    },
    avance: { 
      type: String, 
      required: false
    }
  }],

  
  suspenciones :[{
    ciclo: { 
      type: String, 
      required: false
    },
    suspension: { 
      type: String, 
      required: false
    },
    descripcion: { 
      type: String, 
      required: false
    },
    inicia: { 
      type: String, 
      required: false
    },
    termina: { 
      type: String, 
      required: false
    },
    fechaDeRegistro: { 
      type: String, 
      required: false
    }
  }],
  ingreso: [{
    ciclo: { 
      type: String, 
      required: false
    },
    procedencia: { 
      type: String, 
      required: false
    },
    tipoDeAdmision: { 
      type: String, 
      required: false
    },
    pep: { 
      type: Number,
      required: false
    },
    paa: { 
      type: Number,
      required: false
    },
    pa: { 
      type: Number,
      required: false
    },
    av: { 
      type: Number,
      required: false
    },
    carrera: { 
      type: String, 
      required: false
    }
  }],

  calificaciones: [
    {
      materia: { 
        type: String, 
        required: false 
      },
      calificacion: { 
        type: String, 
        required: false
      },
      calificacionLetra: { 
        type: String, 
        required: false 
      },
      ciclo: { 
        type: String, 
        required: false
      },
      creditos: { 
        type: Number, 
        required: false
      },
    }
  ],
  kardex: [
    {
      cveMateria: { 
        type: String, 
        required: false
      },
      materia: { 
        type: String, 
        required: false 
      },
      nrc: { 
        type: String, 
        required: false
      },
      fecha: { 
        type: String, 
        required: false 
      },
      calificacion: { 
        type: String, 
        required: false 
      },
      calificacionLetra: { 
        type: String, 
        required: false 
      },
      ciclo: { 
        type: String, 
        required: false
      },
      creditos: { 
        type: Number, 
        required: false
      },
      tipo: { 
        type: String, 
        required: false
      },
      tipoDesc: { 
        type: String, 
        required: false
      },
    }
  ]
});

degreeSchema.pre('validate', function (next) {
  console.log('esta intentando actualizar-------------------------------------------------------------------')
  this.ultimoCiclo = this.ultimoCiclo.replace('-','');
  this.fecActualizacion = Date.now();
  
  switch (this.situacion) {
    case 'EGRESADO':
      this.status =  'EG';
      break;
    case 'DESERCION':
      this.status =  'DE';
      break;
    case 'BAJA POR ART 33':
      this.status =  'BC';
      break;
    case 'GRADUADO':
      this.status =  'GD';
      break;
    case 'INACTIVO':
      this.status =  'IN';
      break;
    case 'TITULADO':
      this.status =  'TT';
      break;
    case 'BAJA POR ART 35':
      this.status =  'B5';
      break;
    case 'BAJA VOLUNTARIA':
      this.status =  'BV';
      break;
    case 'BAJA POR RENUNCIA A DICT':
      this.status =  'RD';
      break;
    case 'BAJA POR INGRESO OTRA C':
      this.status =  'BO';
      break;
    case 'BAJA ART 35 CON RETIRO D':
      this.status =  'B6';
      break;
    case 'ACTIVO':
      this.status =  'AC';
      break;
    case 'ALUMNO EN ART 34':
      this.status =  'B4';
      break;
    case 'LICENCIA':
      this.status =  'LI';
      break;
    case 'TERMINACION DE INTERCAM':
      this.status =  'FI';
      break;
    case 'BAJA ADMINISTRATIVA':
      this.status =  'BA';
      break;
    default:
      this.status =  'xxx';
      break;
    }
  this.creditosFaltantes = (this.creditos<this.creditosMinimos) ? this.creditosMinimos - this.creditos : 0 ;
  this.ciclos =   this.listaciclos.length;
  next();
 });

module.exports = mongoose.model('carrera', degreeSchema);
