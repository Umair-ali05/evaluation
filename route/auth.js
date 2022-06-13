const express = require('express');
const authRoute = express.Router();
const employee = require('../api/employee');
const uploadFile = require('../middleware/multerStorage')

authRoute.post('/emplyee' , employee.add )
authRoute.post('/employeeFile' , uploadFile.single('file'), employee.uploadFile )
authRoute.get('/emplyeePhone' , employee.emplyeeByPhone )
authRoute.get('/emplyeePhoto' , uploadFile.single('file'), employee.emplyeePhoto )
authRoute.get('/emplyeeByMail' , employee.emplyeeBymail )
authRoute.post('/sendMail' , employee.sendMail )

//





module.exports = authRoute;