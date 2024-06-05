const path = require('path');

const express = require('express');

const carreraController = require('../controllers/carrera');
const userController = require('../controllers/user');
const rptController = require('../controllers/report');
const settingController = require('../controllers/setting');
const importController = require('../controllers/import');


const router = express.Router();

// gets
router.get('/estudiante', carreraController.getEstudiante);
router.get('/estudiantes', carreraController.getEstudiantes);
router.get('/estudiantecarreras', carreraController.getEstudianteCarreras);
router.get('/carreras', carreraController.getCarreras);
router.get('/users', carreraController.getUsers);


// posts getting data
router.post('/buscacarreras', carreraController.postBuscaCarreras);  
router.post('/carreradetalle', carreraController.getCarreraDetalle);   


// login /user / auth
router.post('/user', userController.postUser);  
router.put('/user', userController.loginupdate);  
router.post('/login', userController.login);  
router.delete('/user', userController.deletetUser);  

//reports 
router.get('/reports', rptController.getReports);  
router.post('/updaterpt', rptController.updaterpt);  
router.get('/importregs', rptController.getImportRegs);

//config
router.get('/setting', settingController.getSetting );  
router.put('/setting', settingController.setSetting );  

// import
router.post('/importSGRACAD', importController.importSGRACAD);  
router.post('/importConstancia', importController.importConstancia);  
router.post('/importFicha', importController.importFicha);  
router.delete('/importregs', importController.delImportRegs);  

router.delete('/deletefromimport', importController.deletefromimport);  
router.get('/importfromsiauu', importController.importfromsiauu);  







// post save data  --- import data from html tables 
router.post('/studentcard', carreraController.postEstudianteCard); // ficha
router.post('/studentconst', carreraController.postEstudianteConstancia); // constancia 
router.post('/sgracad', carreraController.postSGRACAD);
router.post('/kardex', carreraController.postKardex);

/*

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

*/


module.exports = router;
