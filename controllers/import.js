
const mongoose = require('mongoose');

//---- models
const Setting = require('../models/setting');
const Estudiantes = require('../models/estudiante');
const {importdata, importdetail} = require('../models/import');

const Script = require('../models/script');
const Log = require('../models/log');
//-----



const { ObjectId } = require('mongodb');

function yyyymmdd(dat = new Date()) {
  function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
  return '' + dat.getFullYear() + twoDigit(dat.getMonth() + 1) + twoDigit(dat.getDate());
}


exports.importSGRACAD = (req, res, next) => {
  console.log(req.body);
  const allsemesters = req.body.allSemesters.trim();  
  const arrSemesters = allsemesters.split(',');
  if (!allsemesters || arrSemesters.length<1) {
    console.log(err);
    res.status(500).json({
      status: 'debe proporcionar semestres',
    });
    res.end; 
    return;
  }
 
  try {
    Script.findOne({name: "SGRACAD"})
    .then(script => {


      const importReg = new importdata({
        idScript: 'SGRACAD',
        position: 1,
        script: script.script
      });
      importReg.save();

      for (let i = 0; i<arrSemesters.length; i++ ) {
        const detail = new importdetail({
          idScript: 'SGRACAD',
          datavalue: arrSemesters[i]
        });
        detail.save();
      }
      
      res.status(200).json({
        status: 'success',
        data:{
          status: 'ok',
        }
      });
      return;
      })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: 'error en edit user 3',
      });
      res.end; 
      return;
    });
    

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "setsetting",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error en login 4',
    })
    res.end; 
  }
};



exports.importConstancia = (req, res, next) => {
  const fechasExculirConst = (req.body.fechasExculirConst) ? req.body.fechasExculirConst.trim() : undefined;  
  const arrfechasExculirConst = (fechasExculirConst) ? fechasExculirConst.split(',') : [];
  try {
    Script.findOne({name: "CONSTANCIAS"})
    .then(script => {


      const importReg = new importdata({
        idScript: 'CONSTANCIAS',
        position: 2,
        script: script.script
      });
      importReg.save();

      let query= arrfechasExculirConst.length>0 ?  {"actualizadoPorConstancia": {"$nin": arrfechasExculirConst}} : {};
      Estudiantes.find(query)
      .then ((estudiante => {
         
        for (let i = 0; i<estudiante.length; i++ ) {
          console.log(estudiante[i].codigo);
          
          if (estudiante[i].codigo) {
            let detail = new importdetail({
              idScript: 'CONSTANCIAS',
              datavalue: estudiante[i].codigo
            });
            detail.save();
          }
          
        }

      }))

      res.status(200).json({
        status: 'success',
        data:{
          status: 'ok',
        }
      });
      return;
      })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: 'error en edit user 3',
      });
      res.end; 
      return;
    });
    

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "setsetting",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error en login 4',
    })
    res.end; 
  }
};




exports.importFicha = (req, res, next) => {
  const fechasExculirFicha = (req.body.fechasExculirFicha) ? req.body.fechasExculirFicha.trim() : undefined;  
  const arrfechasExculirFicha = (fechasExculirFicha) ? fechasExculirFicha.split(',') : [];
  try {
    Script.findOne({name: "FICHAS"})
    .then(script => {


      const importReg = new importdata({
        idScript: 'FICHAS',
        position: 2,
        script: script.script
      });
      importReg.save();

      let query= arrfechasExculirFicha.length>0 ?  {"actualizadoPorFicha": {"$nin": arrfechasExculirFicha}} : {};
      Estudiantes.find(query)
      .then ((estudiante => {
         
        for (let i = 0; i<estudiante.length; i++ ) {
          console.log(estudiante[i].codigo);
          
          if (estudiante[i].codigo) {
            let detail = new importdetail({
              idScript: 'FICHAS',
              datavalue: estudiante[i].codigo
            });
            detail.save();
          }
          
        }

      }))

      res.status(200).json({
        status: 'success',
        data:{
          status: 'ok',
        }
      });
      return;
      })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: 'error en edit user 3',
      });
      res.end; 
      return;
    });
    

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "setsetting",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error en login 4',
    })
    res.end; 
  }
};




exports.deletefromimport = (req, res, next) => {
  let id= req.body.id;
  console.log(`borrado de registro ${id}`);
  try {
    importdetail.deleteOne({_id: ObjectId(id)})
    .then(importReg => {
      
      console.log(importReg);
      if (importReg) {
        console.log(` Se borro el registro ${id}`);
        res.status(200).json({
          status: 'success',
          data:{ id }
        });
        res.end;
        return;
      }
    }) 
    .catch(err => {
      count=max;
      console.log(err);
      res.status(500).json({
        status: 'error en delete import ' + id,
      });
      res.end; 
      return;
      
    });
  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "setsetting",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error en login 4',
    })
    res.end;   
  };
}

exports.delImportRegs = (req, res, next) => {
  console.log(`delImportRegs`);
  
  importdata.deleteMany()
  .then(response => {
    return importdetail.deleteMany()
  })
  .then(response => {
    console.log(response );
    res.status(200).json({
      status: 'success',
      data: response
    });
  })
  .catch(err => console.log(err));
};


exports.importfromsiauu = (req, res, next) => {
  console.log('importfromsiauu');
  recursiveImportfromsiauu(req, res, next);
};

const recursiveImportfromsiauu = (req, res, next) => {
  try {
    importdata.findOne({},{}, {sort: {position:1}})
    .then(importReg => {
      if (importReg) {
        // console.log(importReg);
        //todo: get limit from settings
          importdetail.find({idScript: importReg.idScript}, {datavalue:1}, {limit:50})
          .then ((detail => {
            if (detail && detail.length>0) {
              console.log(`entro a detalle`);
              console.log(detail);
              res.status(200).json({
                status: 'success',
                data:{
                  script: importReg.script,
                  detail: detail
                }
              });
              res.end;
              return;
              
            } else {
              // delete reg
              console.log(`entro a borrar el registro import ${importReg._id}`);
              importdata.deleteOne({_id: ObjectId(importReg._id)})
              .then( (response) => {
                console.log(response);
              })
              .catch(err => {
                count=max;
                console.log(err);
                res.status(500).json({
                  status: 'error en edit user 3',
                });
                res.end; 
                return;
                
              });
              
              recursiveImportfromsiauu(req, res, next);
            }

        }))
      } else {
        //there is no regs
        console.log(`entro a else, no encontro registros `);
        res.status(200).json({
          status: 'success',
          data:{
            script: {},
            detail: []
          }
        });
        res.end;
        return;
      }
      })
      .catch(err => {
        count=max;
        console.log(err);
        res.status(500).json({
          status: 'error en edit user 3',
        });
        res.end; 
        return;
        
      });
    

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "setsetting",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error en login 4',
    })
    res.end; 
  }


  
}
  