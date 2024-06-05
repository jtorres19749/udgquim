const User = require('../models/user');
const Log = require('../models/log');
const { ObjectId } = require('mongodb');
const {v4: uuidv4 } = require('uuid') ;
var bcrypt = require('bcryptjs');



function yyyymmdd(dat = new Date()) {
  function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
  return '' + dat.getFullYear() + twoDigit(dat.getMonth() + 1) + twoDigit(dat.getDate());
}

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




exports.login = (req, res, next) => {
  
  const email = req.body.email.trim();  
  const password = req.body.password.trim();  
  
  try {
    User.findOne({$or: [ { email: {$eq: email} }, {username: {$eq:email }}]})
    .then(user => {
      if (user && !user.tmpid) {
        // exists user and is not new, must have a password
        let psw = user.password || 'xxx';
        // var salt = bcrypt.genSaltSync(10);
        // var hash = bcrypt.hashSync("B4c0/\/", salt);
        if (bcrypt.compareSync(password, psw)) {
          loginReturn(res,user);
        } else {
          console.log('fallo ')
          res.status(500).json({
            status: 'error en login 1',
          })
          res.end; 
          return
        }
      } else if (user){
        // exists user and is new, have a tmp
        loginReturn(res,user);
      } else {
        res.status(500).json({
          status: 'error en login 2',
        })
        res.end; 
        return
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: 'error en login 3',
      });
      res.end; 
      return
    });
    

  } catch (err) {
    console.log(err);
    Log.create({
      tipo: "error",
      tags: "login",
      descripcion: err.message,
      datos : req.body
    })

    res.status(400).json({
      status: 'error en login 4',
    })
    res.end; 
  }
};


function loginReturn(res, user){
  let userCopy = {...user};
  userCopy.password = "";

  res.status(200).json({
    status: 'success',
    data: btoa(JSON.stringify(
      userCopy
    ))
  });
  res.end;
}


exports.loginupdate = (req, res, next) => {
  console.log(req.body);
  
  const username = req.body.username.trim();    
  const name = req.body.name.trim();  
  const email = req.body.email.trim();  
  const password = req.body.password.trim();  
  console.log(email);
  
  try {
    User.findOne({$or: [ { email: {$eq: email} }, {username: {$eq:email }}]})
    .then(user => {
      if (user && user.tmpid) {

        let salt = bcrypt.genSaltSync(10);
        
        user.name = name;
        user.username= username;
        user.password =  bcrypt.hashSync(password, salt);
        user.tmpid = '';
        user.save();

        loginReturn(res,user);
        return
      } else if (user){
        res.status(500).json({
          status: 'error en edit user 1',
        })
        res.end; 
        return

      } else {
        res.status(500).json({
          status: 'error en edit user 2',
        })
        res.end; 
        return
      }
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
      tags: "login",
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