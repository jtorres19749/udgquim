const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors=require('cors');

const errorController = require('./controllers/error');
const User = require('./models/user');
const Carrera = require('./models/carrera');
const Estudiante = require('./models/estudiante');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(cors())

const adminRoutes = require('./routes/admin');
//const shopRoutes = require('./routes/shop');

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())

app.use((req, res, next) => {
  User.findById('5bab316ce0a7c75f783cb8a8')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/api', adminRoutes);
// app.use(shopRoutes);
app.use(errorController.get404);


mongoose
  // localhost 
  // 'mongodb://127.0.0.1:27017/myapp',
  // remote
  // 'mongodb+srv://jtorresadmin:udg2024@cluster0.nmxcisr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', 

  .connect(
    'mongodb://127.0.0.1:27017/myapp', 
    { useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false , dbName: 'quimica'},
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'jtorres',
          email: 'jtorres19749@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });

    // update carreras calculated fields --------------------------------------------------------------------------------------------
       
    /*
    Carrera.find().then(carreras => {
      
      if (carreras) {
    
        // console.log(`Actualizando ${carreras.length} carreras --`)
        for (var i = 0;i<carreras.length;i++){
          let carrera = carreras[i];
    
          // console.log(`actualizando ${carrera.codigo} - situacion: ${carrera.situacion}, estatus : ${carrera.estatus}`);
          if (carrera.hasOwnProperty('actualiza') && carrera.actualiza) {
            carrera.actualiza = carrera.actualiza + 1;
          } else {
            carrera.actualiza = 1;
          }
          
          
          Estudiante.findOne({'codigo':carrera.codigo})
          .then(student => {
          console.log(student);
          carrera.estudiantedetalle= student._id;
          })
          .catch(err => console.log(err));
           

          carrera.save();
        }
      }


    });
    */
        // update end -------------------------------------------------------------------------------------------------------------------------


    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
