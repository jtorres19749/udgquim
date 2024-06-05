const Setting = require('../models/setting');
const Log = require('../models/log');
const { ObjectId } = require('mongodb');

function yyyymmdd(dat = new Date()) {
  function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
  return '' + dat.getFullYear() + twoDigit(dat.getMonth() + 1) + twoDigit(dat.getDate());
}

  // 
  exports.getSetting = (req, res, next) => {
    Setting.findOne()
      .then(setting => {
        console.log('setting' );
        console.log(setting );
        res.status(200).json({
          status: 'success',
          data:{
            setting : setting
          }
        });
      })
      .catch(err => console.log(err));
  };
  
  
  

exports.setSetting = (req, res, next) => {
  console.log(req.body);
  const actualSemester = req.body.actualSemester.trim();    
  const lastSemester = req.body.lastSemester.trim();  
  const allsemesters = req.body.allSemesters.trim(); 
  const importbatchsize = req.body.importBatchSize || 50; 
  
  try {
    Setting.findOne()
    .then(setting => {
        setting.actualSemester = actualSemester;
        setting.lastSemester= lastSemester;
        setting.allsemesters =  allsemesters;
        setting.importbatchsize = importbatchsize;
        setting.save();
        res.status(200).json({
          status: 'success',
          data:{
            setting : setting
          }
        });
        return
      })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: 'error en edit user 3',
      });
      res.end; 
      return
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
