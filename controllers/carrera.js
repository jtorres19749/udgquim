const SGRACAD_ROWSHEADER = 7; 
const SGRACAD_COLUMNS_IN_DATA_ROW = 19; 
const SGRACAD_COLUMN_SGRACAD = "col-3";

//SGRACAD Column names in Data Row 
const SGRACAD_COLUMN_CODIGO = "col-5";
const SGRACAD_COLUMN_NOMBRE = "col-3";
const SGRACAD_COLUMN_STATUS= "col-7";
const SGRACAD_COLUMN_CICLOS= "col-15";
const SGRACAD_COLUMN_ULTIMOCICLO= "col-17";
const SGRACAD_COLUMN_CREDITOS= "col-9";
const SGRACAD_COLUMN_PROMEDIO= "col-9";
const SGRACAD_COLUMN_CREDITOSFALTANTES= "col-11";

const COLUMNA_GENERICA_SUBTITULO = "title_generic_col";

const CALIFICACION_SIN_DERECHO  = "SD";

const Estudiante = require('../models/estudiante');
const Carrera = require('../models/carrera');
const User = require('../models/user');
const Log = require('../models/log');
const { ObjectId } = require('mongodb');

const {v4: uuidv4 } = require('uuid') ;


function yyyymmdd(dat = new Date()) {
  function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
  return '' + dat.getFullYear() + twoDigit(dat.getMonth() + 1) + twoDigit(dat.getDate());
}

// un solo estudiante pero con las carreras
exports.getEstudiante = (req, res, next) => {
    const codigo = req.params.codigo;  
  
    Estudiante.findOne({'codigo':codigo})
    .populate({path : 'carreras'})
    .then(student => {
      console.log(student);
      
      res.status(200).json({
        status: 'success',
        results: student.length,
        data:{
            student:student
        }
      });
      res.end;
      
    })
    .catch(err => console.log(err));
};


// todos los estudiantes sin carreras
exports.getEstudiantes = (req, res, next) => {
    Estudiante.find()
      // .select('title price -_id')
      // .populate('userId', 'name')
      .then(students => {
        console.log(students);
        res.status(200).json({
          status: 'success',
          results: students.length,
          data:{
            students:students
          }
        });
      })
      .catch(err => console.log(err));
  };

  // todos los estudiantes y sus carreras
  exports.getEstudianteCarreras = (req, res, next) => {
    Estudiante.find().populate({path: 'carreras'})
      // .select('title price -_id')
      // .populate('userId', 'name')
      .then(students => {
        console.log(students);
        res.status(200).json({
          status: 'success',
          results: students.length,
          data:{
            students:students
          }
        });
      })
      .catch(err => console.log(err));
  };

  // solo las carreras
  exports.getCarreras = (req, res, next) => {
    Carrera.find()
      .then(carreras => {
        console.log(carreras);
        res.status(200).json({
          status: 'success',
          results: carreras.length,
          data:{
            carreras:carreras
          }
        });
      })
      .catch(err => console.log(err));
  };

  // solo las carreras
  exports.getUsers = (req, res, next) => {
    User.find()
      .then(users => {
        console.log(users);
        res.status(200).json({
          status: 'success',
          results: users.length,
          data:{
            users:users
          }
        });
      })
      .catch(err => console.log(err));
  };
  
  
  
  

/*
  exports.getEstudiantesList = (req, res, next) => {
    Estudiante.find({}).select({ "codigo": 1, "_id": 0})
      .then(students => {
        console.log(students);
        res.status(200).json({
          status: 'success',
          results: students.length,
          data:{
            students:students
          }
        });
      })
      .catch(err => console.log(err));
  };
*/  
  


// ---------------------- posts --------------------------------------------------

// postfind

// carrera y estudiante
exports.getCarreraDetalle = (req, res, next) => {
    
  const id = req.body.id;  
  console.log(req);
  Carrera.findOne({_id : ObjectId(id)}).populate({path: 'estudiantedetalle'})
    .then(carrera => {
      console.log(carrera);
      res.status(200).json({
        status: 'success',
        data: carrera
      });
    })
    .catch(err => console.log(err));
};



exports.postBuscaCarreras = (req, res, next) => {
  const find = req.body.find;  
  const projection = req.body.projection;  
  const skip = req.body.skip;  
  const limit = req.body.limit;  
  const sort = req.body.sort;  
  // console.log(req);
  console.log(find);

  try {
    Carrera.find(find, projection, {skip, limit, sort})
    .then(data => { 
      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).json({
        status: 'success',
        data: data
      });
    
    })
    
    
    ;
  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "postBuscaCarreras, buscarCarreras",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error al buscar carreras',
    })
    res.end; 
  }
  
  
};



exports.postUser = (req, res, next) => {
  const name = req.body.name.trim();  
  const email = req.body.email.trim();  
  // console.log(req);
  console.log(name, ''  , email);

  try {
    uuidv4();
    const tmpid = uuidv4();

    User.findOne({email: {$eq: email}})
    .then(user => {
      if (!user) {
        const user = new User({
          name: name,
          email: email,
          tmpid: tmpid,
          admin: false
        });
        user.save();
        res.status(200).json({
          status: 'success',
          data: user
        });

      } else {
        res.status(500).json({
          status: 'error al dar de alta usuario que ya existe',
        })
        res.end; 
      }
    });

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "postUser",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error al dar de alta usuario',
    })
    res.end; 
  }
  
  
};



exports.deletetUser = (req, res, next) => {
  const _id = req.body._id.trim();  

  try {
    User.deleteOne({_id: ObjectId(_id)})
    .then(user => {
      res.status(200).json({
        status: 'success',
        data: user
      });
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: 'error al dar de baja usuario',
      });
      res.end; 

    });
    

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "postUser",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error al dar de alta usuario',
    })
    res.end; 
  }
  
  
};







// ---------------------------------------------------import html tables -----------------------------------------------

exports.postEstudianteConstancia = (req, res, next) => {
  // constancia 
  const data = convertDataEstudianteConstancia(req.body);
  const filter = { codigo: data.codigo, admision: data.admision };


  try {
    // busca la carrera
    Carrera.findOneAndUpdate(filter, data, {new: true, upsert:true})
    .then(carrera => {
      
        const filterEst = { codigo: carrera.codigo};
        const dataEst = {
            correoInstitucional: data.correoInstitucional,
            actualizadoPorConstancia: yyyymmdd(),
            $addToSet: {carreras: carrera._id} 
          } 

        Estudiante.findOneAndUpdate(filterEst, dataEst, {new: true, upsert:true})
        .then(estudiante => {
            console.log(`Se registro carrera de estudiante: ${estudiante.codigo}`); 
            respondeOk (res, `Codigo: ${estudiante.codigo}`);
        })
      });

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "postEstudianteConst, constancia",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error al intentar registro',
    })
    res.end; 
  }
  
};



exports.postEstudianteCard = (req, res, next) => {
  // ficha 
  // console.log(req.body);
  const data = convertDataEstudianteCard(req.body);
  const filter = { codigo: data.codigo, admision: data.admision};

  try {
    // busca la carrera
    Carrera.findOneAndUpdate(filter, data, {new: true, upsert:true})
    .then(carrera => {
      
        const filterEst = { codigo: carrera.codigo};
        const dataEst = {
            correoInstitucional: data.correoInstitucional,
            actualizadoPorFicha: yyyymmdd(),
            $addToSet: {carreras: carrera._id} 
          } 

        Estudiante.findOneAndUpdate(filterEst, dataEst, {new: true, upsert:true})
        .then(estudiante => {
            console.log(`Se registro carrera de estudiante: ${estudiante.codigo}`); 
            respondeOk (res, `Codigo: ${estudiante.codigo}`);
        })
      });

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "postEstudianteCard, ficha",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error al intentar registro',
    })
    res.end; 
  }
};


exports.postSGRACAD = (req, res, next) => {
  const tableReg = convertDataSGRACAD(req.body);
  console.log(`Numero de registros recibidos: ${tableReg.length}`);

  //actualiza o agrega  
  try {
    // busca al estudiante
    
    for (r=0; r<tableReg.length;r++) {
      let data = tableReg[r];

      let filter = { codigo: data.codigo};
      let datafields = { 
        nombre: data.nombre,
        actualizadoPorSGRACAD: yyyymmdd()
      };

      Estudiante.findOneAndUpdate(filter, datafields, {new: true, upsert:true})
      .then(estudiante => {
        console.log(`Se actualizo o dio de alta al estudiante con codigo: ${estudiante.codigo}`);
      })
    }
    respondeOk (res);
    

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "postSGRACAD, SGRACAD",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error al intentar registro',
    })
    res.end; 
  }
    
};


exports.postKardex = (req, res, next) => {
  const data = convertDataKardex(req.body);
  const filter = { codigo: data.codigo };

  
  try {
    // busca la carrera
    Carrera.findOne(filter).then(carrera => {
      if (!carrera) {
        carrera = new Carrera(data);
      } else {
        Object.keys(data).forEach((value)=>{student[value]=data[value] });
      }
      
      carrera.save().then(carreraData => {
        
        Estudiante.findOne({ codigo: data.codigo})
        .then(estudiante => {
          if (!estudiante) {
            // si no existe el estudiante, lo crea
            let newEstudiante = new Estudiante(
              { 
                codigo: data.codigo,
                nombre: data.nombre,
                actualizadoPorKardex: yyyymmdd(), 
                carreras: [
                  carreraData._id
                ]
              }
            );
            newEstudiante.save().then(userData => {
              respondeOk (res, `Se registro carrera y estudiante nuevo : ${userData.codigo}`);
            }).catch(err => mandaError(err));
          } else {

            //si no existe  la carrera, la agrega al listado del estudiante, si ya existe no hace nada
            if (estudiante.indexOf(carreraData._id)==-1) {
              estudiante.push (carreraData._id);
              estudiante.actualizadoPorKardex = yyyymmdd();
              estudiante.save().then(userData => {
                respondeOk (res, `Codigo: ${userData.codigo}`);
              }).catch(err => mandaError(err));

            }

          } 
        }).catch(err => mandaError(err));
      });
      
    });
  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "postKardex, kardex",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error al intentar registro',
    })
    res.end; 
  }
  


};








// ----------------------- utils ----------------------------- todo: move to another file


function getData(jsonData){
  let data = {};
  // the first level is for frames
  for (fr=0; fr<jsonData.length; fr++){
    //each frame has a document that is an array with tables and has other properties
    let doc = jsonData[fr].document;
    for (t=0; t<doc.length; t++){
      // if is a table with json type {key: value} or if has only data 
      let table = doc[t];
      if (table.contains == "hasTitle,hasKeyValues" || table.contains == "hasKeyValues" ) {
        for (r=0; r<table.data.length; r++){
          let row = table.data[r];
          let keys = Object.keys(row);
          for (k=0; k<keys.length; k++){
            data[keys[k]] = row[keys[k]];
          }
        }
      }
    }
  }
  return data;
}









function convertCalificaciones(jsonData) {
    return jsonData.map( (value)=>{return {
        materia: value.Materia,
        calificacion: value.Calificacion,
        calificacionLetra: value.Calificacion2,
        ciclo: value.Ciclo,
        creditos: value.Creditos
      }}
    );
}

function convertCiclos(jsonData) {
  return jsonData.map( (value)=>{return {
    ciclo: value.Ciclo,
    admision: value.Admision,
    centro: value.Centro,
    sede: value.Sede,
    promedio: value.Promedio,
    creditos: value.Creditos,
    avance: value.DeAvance
    }}
  );
}

function convertSuspenciones(jsonData) {
  return jsonData.map( (value)=>{return {
    
    ciclo: value.Ciclo,
    suspension: value.Suspension,
    descripcion: value.Descripcion,
    inicia: value.Inicia,
    termina: value.Termina,
    fechaDeRegistro: value.FechaDeRegistro
    }}
  );
}

function convertIngreso(jsonData) {
  return jsonData.map( (value)=>{return {
    ciclo: value.Ciclo,
    procedencia: value.EscuelaDeProcedencia,
    tipoDeAdmision: value.TipoDeAdmision,
    pep: value.Pep,
    paa: value.Paa,
    pa: value.Pa,
    av: value.Av,
    carrera: value.Carrera
    }}
  );
}


function convertDataEstudianteConstancia(data) {
  // this is for Ficha  de calificaciones
  let jsonData = getData(data);
  jsonData["calificaciones"] =[];
  if (data[1] && data[1].hasOwnProperty('document') && data[1].document[4].hasOwnProperty('contains') && data[1].document[4].contains ==  'hasTitle,hasColumnRows') {
    jsonData["calificaciones"] = convertCalificaciones(data[1].document[4].data);
  } 
  console.log(jsonData);
  return {
    codigo: jsonData.Codigo,
    nombre: jsonData.Nombre,
    situacion: jsonData.Situacion,
    admision: jsonData.Admision,
    nivel: jsonData.Nivel,
    ultimoCiclo: jsonData.UltimoCiclo,
    carrera: jsonData.Carrera,
    centro: jsonData.Centro,
    sede: jsonData.Sede,
    creditos: jsonData.Creditos,
    fecha: jsonData.Fecha,
    promedio: jsonData.Promedio,
    creditosMaximos: jsonData.CreditosMaximos,
    creditosMinimos: jsonData.CreditosMinimos,
    porcentajeEnCreditos: jsonData.PorcentajeEnCreditos,
    calificaciones: jsonData["calificaciones"]
    
  }
}



function convertDataEstudianteCard(data) {
    // this is for Boleta de calificaciones
    let jsonData = getData(data);
    console.log(jsonData);
    let correo = data[1].document[1].data[0].CorreoInstitucional;
    if (correo.indexOf('@')>-1) {
      jsonData["correoInstitucional"] = correo;
    }
    
    jsonData["listaciclos"] = convertCiclos(data[1].document[2].data);
    jsonData["suspenciones"] = convertSuspenciones(data[1].document[3].data);
    if (jsonData["suspenciones"].length>0 && jsonData.suspenciones[0].ciclo == 'NO HAY REGISTRO DE SUSPENSIONES') {
      console.log(`no de susp.: ${jsonData["suspenciones"].length}`);
      console.log(`reg de susp.: ${jsonData.suspenciones[0].ciclo}`);
      jsonData["suspenciones"] = [];
    }
    jsonData["ingreso"] = convertIngreso(data[1].document[5].data);
    console.log(jsonData);
    
    return {
      codigo: jsonData.Codigo,
      nombre: jsonData.Nombre,
      situacion: jsonData.Situacion,
      admision: jsonData.Admision,
      nivel: jsonData.Nivel,
      ultimoCiclo: jsonData.UltimoCiclo,
      carrera: jsonData.Carrera,
      centro: jsonData.Centro,
      sede: jsonData.Sede,
      correoInstitucional: jsonData.correoInstitucional,
      listaciclos: jsonData.listaciclos,
      suspenciones: jsonData.suspenciones,
      ingreso: jsonData.ingreso
    }
}

// "Calendario 23 B"
function convertKardexCalificaciones(jsonData) {
  return jsonData.map( (value)=>{
    let calif = value.Calificacion;
    let tipo = value.Tipo;
    let califArr = calif.substring(0,calif.length-1).split('(');
    let periodo = value[COLUMNA_GENERICA_SUBTITULO].split(' ');
    let tipoArr = (tipo.substring(0,tipo.length-1)).split('(');

    console.log(`califArr: `);
    console.log(califArr);

    console.log(`tipo: `);
    console.log(tipoArr);


    return {
      cveMateria: value.Clave,
      materia: value.NombreDeLaMateria,
      nrc: value.Nrc,
      fecha: value.Fecha,
      calificacion: (califArr[0].trim()==CALIFICACION_SIN_DERECHO) ? 0: parseInt(califArr[0]),
      calificacionLetra: califArr[1].trim(),
      ciclo: `20${periodo[1]}${periodo[2]}`,
      creditos: value.Nc,
      tipo: tipoArr[1],
      tipoDesc: tipoArr[0].trim(),
    }}
  );
}


function convertDataKardex(data) {
  let jsonData = getData(data);
  console.log(`jsonData:`);
  console.log(jsonData);

  jsonData["kardex"] = convertKardexCalificaciones(data[1].document[2].data);
  return {
    codigo: jsonData.Codigo,
    nombre: jsonData.Nombre,
    admision: jsonData.Admision,
    nivel: jsonData.Nivel,
    situacion: jsonData.Situacion,
    ultimoCiclo: jsonData.UltimoCiclo,
    carrera: jsonData.Carrera,
    centro: jsonData.Centro,
    sede: jsonData.Centro,
    creditos: jsonData.Creditos,
    fecha: jsonData.Fecha,
    promedio: jsonData.Promedio,
    creditosMaximos: jsonData.CreditosMaximos,
    creditosMinimos: jsonData.CreditosMinimos,
    creditosFaltantes: jsonData.CreditosFaltantes,
    creditosRequeridosDelPrograma: jsonData.CreditosRequeridosDelPrograma,
    porcentajeEnCreditos: jsonData.PorcentajeEnCreditos,
    creditosAreaBasicoRequeridos: jsonData.BasicoParticularObligatoria,
    creditosAreaBasicoAdquiridos: jsonData.BasicoParticularObligatoria1,
    creditosAreaEspecializanteRequeridos: jsonData.EspecializanteObligatoria, 
    creditosAreaEspecializanteAdquiridos: jsonData.EspecializanteObligatoria1,
    creditosAreaFormacionRequeridos: jsonData.FormacionBasicaComun,
    creditosAreaFormacionAdquiridos: jsonData.FormacionBasicaComun1,
    creditosAreaOptativaRequeridos: jsonData.OptativaAbierta,
    creditosAreaOptativaAdquiridos: jsonData.OptativaAbierta1,
    kardex: jsonData.kardex
  }
}


function convertDataSGRACAD(jsonData) {
    let data = [];
    // the first level is for frames
    // console.log(`jsonData.length: ${jsonData.length}`);
    for (fr=0; fr<jsonData.length; fr++){
      //each frame has a document that is an array with tables and has other properties
      let doc = jsonData[fr].document;
      for (t=0; t<doc.length; t++){
        // if is a table with only data without columns
        let table = doc[t];
        if (table.contains == "hasColumnRows" ) {
          
          
          //check if is a SGRACAD report type
          
          if (table.data.length>SGRACAD_ROWSHEADER 
            &&  Object.keys(table.data[1]).indexOf(SGRACAD_COLUMN_SGRACAD)>-1 
            && table.data[1][SGRACAD_COLUMN_SGRACAD] == "SGRACAD") {

            console.log(`table.data.length: ${table.data.length}   SGRACAD_COLUMN_SGRACAD: ${table.data[1][SGRACAD_COLUMN_SGRACAD]}`);

            // sweeps the rest of the records
            for (r=7; r<table.data.length; r++){
              let row = table.data[r];
              // if the row contains the columns to be a row with student data
              let nocolumns = Object.keys(row); 
              if ( nocolumns.length == SGRACAD_COLUMNS_IN_DATA_ROW ) {

                // ahora solo da de alta al estudiante
                let studentRaw = {
                  codigo: row[SGRACAD_COLUMN_CODIGO],
                  nombre: row[SGRACAD_COLUMN_NOMBRE]
                };

                /* codigo anterior 
                let studentRaw = {
                  codigo: row[SGRACAD_COLUMN_CODIGO],
                  nombre: row[SGRACAD_COLUMN_NOMBRE],
                  status: row[SGRACAD_COLUMN_STATUS],
                  ciclos: + row[SGRACAD_COLUMN_CICLOS],
                  ultimoCiclo: row[SGRACAD_COLUMN_ULTIMOCICLO],
                  creditos: + row[SGRACAD_COLUMN_CREDITOS],
                  promedio: + row[SGRACAD_COLUMN_PROMEDIO],
                  creditosFaltantes: + row[SGRACAD_COLUMN_CREDITOSFALTANTES]
                };
                */

                // console.log(studentRaw);
                data.push(studentRaw);
              }
            }
          }
        }
      }
    }
    return data;

}

function mandaError(res, err){
  console.log(err);
  Log.create({
    tipo: "error",
    tags: "postEstudianteConst, constancia",
    descripcion: err.message,
    datos : req.body
  })

  res.status(400).json({
    status: 'error al intentar registro',
  })
  res.end; 
}


function respondeOk (res, msg='Ok') {
  res.status(200).json({
    status: 'success',
    message: msg
  })
  res.end; 
}