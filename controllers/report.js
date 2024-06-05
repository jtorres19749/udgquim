const { ObjectId } = require('mongodb');
const {v4: uuidv4 } = require('uuid') ;
var bcrypt = require('bcryptjs');


//own
const Report = require('../models/report');
const Estudiante = require('../models/estudiante');
const Carrera = require('../models/carrera');
const {importdata, importdetail} = require('../models/import');

const User = require('../models/user');
const Log = require('../models/log');



function yyyymmdd(dat = new Date()) {
  function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
  return '' + dat.getFullYear() + twoDigit(dat.getMonth() + 1) + twoDigit(dat.getDate());
}

  // solo las carreras
  exports.getReports = (req, res, next) => {
    Report.find()
      .then(rpts => {
        console.log(rpts);
        res.status(200).json({
          status: 'success',
          results: rpts.length,
          data:{
            rpts:rpts
          }
        });
      })
      .catch(err => console.log(err));
  };

  
exports.updaterpt = (req, res, next) => {
  const id = req.body.id.trim();  
  console.log(id);
  
  try {
    Report.findOne({_id: ObjectId(id)})
    .then(rpt => {
      if (rpt) {
        switch(rpt.subtitle){
          case 'Total estudiantes':
            Estudiante.count({}, function( err, count){
              rpt.title = count.toString();
              console.log( "Number of students:", count );
              rpt.save();
              res.status(200).json({
                status: 'success',
                data: rpt
              });
              
            })
            break;
          case 'Total carreras':
              Carrera.count({}, function( err, count){
                rpt.title = count;
                console.log( "Number of carreras:", count );
                rpt.save();
                res.status(200).json({
                  status: 'success',
                  data: rpt
                });
                                

              })
              break
              
          case 'Pendientes por importar':
              importdetail.count({}, function( err, count){
                rpt.title = count;
                console.log( "Pendientes por importar:", count );
                rpt.save();
                res.status(200).json({
                  status: 'success',
                  data: rpt
                });
                                

              })  
              break
              
          }
        
        
        return;

      } else {
        res.status(500).json({
          status: 'error al actualizar reporte ',
        })
        res.end; 
      }
    });

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "updaterpt",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error al actualizar reporte',
    })
    res.end; 
  }
}; 


  
// todos los estudiantes sin carreras
exports.getImportRegs = (req, res, next) => {
  importdetail.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(students => {
      console.log('getImportRegs');
      res.status(200).json({
        status: 'success',
        results: students.length,
        data:{
          importregs:students
        }
      });
    })
    .catch(err => console.log(err));
};


  
  
  
  