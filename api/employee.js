const mongoDb = require('mongoose')
const emplyee = require('../model/employee')
const csvtojson = require('convert-csv-to-json')
const fs = require('fs')
const { json } = require('body-parser')
const path = require('path')
require('dotenv').config();
const nodemailer = require("nodemailer");
const { PAGE , LIMIT ,SERVICE, GMAILNAME , GMAILPASSWORD } = process.env;
exports.add=async (req,res)=>{
    console.log(typeof req.body);
    const {employeeTitle , name,mail,phone,status , cnic } =req.body;
    if (!name) {
        return res.status(400).send({ success: false, message: 'please enter name' })
    }
    if (!mail) {
        return res.status(400).send({ success: false, message: 'please enter mail' })
    }
    if (!phone) {
        return res.status(400).send({ success: false, message: 'please enter phone number' })
    }
    try {
        const alreadyStored = emplyee.findOne({mail , phone});
        if(alreadyStored){
            return res.status(400).send({ success: false, message: "with this mail and phone detail user already exist" })
        }
        else{
        const employee = new emplyee({
        employeeTitle : employeeTitle,
        name : name,
        mail : mail,
        phone: phone,
        status : status,
        cnic
    })
    await employee.save();
    return res.status(200).send({ success: true, employee })
}
    } catch (error) {
        if(error.errors.mail){
            return res.status(400).send({ success: false, message: "your email is not valid" })
        }
        if(error.errors.employeeTitle){
            return res.status(400).send({ success: false, message: "please provide a valid employee title" })
        }
        return res.status(400).send({ success: false, message:error })
        
    }
}

exports.uploadFile = async (req,res)=>{
    if (!req.file) {
    return res.status(400).send({ success: false, message: 'no file uploaded' });
  }
  try {
    console.log( fs.readFile(req.file.path, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        else{
            console.log(data.toString());
    //         const csvfile=data.toString()
    //         let json = csvtojson.getJsonFromCsv(csvfile);
    //          for(let i=0; i<json.length;i++){
    //             json[i]
    //             }
    //             console.log("hjgf::::"+json);
        }
      }));
  } catch (error) {
    return res.status(500).send({ success: false, error: error });
  }
}




exports.emplyeeByPhone = async (req,res)=>{
    const {number} = req.query
    try {
        var newNumber;
        if(number[0]&&number[1]&&number[2] != "*"){
            newNumber = number[0]+number[1]+number[2];
        }
        if(number[4]&&number[5]&&number[6] !="*"){
            newNumber = number[4]+number[5]+number[6];
        }
        if(number[7]&&number[8]&&number[9]&&number[10] !="*"){
            newNumber = number[7]+number[8]+number[9]+number[10];
        }
        const findEmployByNumber = await emplyee.find({phone : {
            $regex : newNumber 
        }}).select("name , mail ,phone , employeeTitle").skip(PAGE * LIMIT).limit(LIMIT);
        
       return res.status(200).send({ success: true , message :findEmployByNumber  });
    } catch (error) {
        return res.status(400).send({ success:false , error:error });
    }}
    

                            
                
    

exports.emplyeePhoto= async(req,res)=>{
     const {mail} = req.query
    if (!mail) {
        return res.status(400).send({ success: false, message: 'please provide mail' });
      }
      if (!req.file) {
        return res.status(400).send({ success: false, message: 'no file uploaded' });
      }
      try {
        const path = ('media/profiles/' + req.file.filename)
        const profileAdded = await emplyee.findOneAndUpdate({mail : mail}, {profile : path})
        
        profileAdded.save()
        return res.status(200).send({ success: false, message: profileAdded});
        
      } catch (error) {
        return res.status(400).send({ success: false, error});
      }
}

exports.emplyeeBymail = async (req,res)=>{
    const { mail} = req.query
    try{
    const employeeByMail = await emplyee.find({mail:mail}).select("name , mail ,phone , employeeTitle")

   if( employeeByMail.status == true && employeeByMail){
    return res.status(200).send({ success: false, message:employeeByMail });
   }else{
    return res.status(400).send({ success: false, message :"mo user employee"});
   }
    }
   catch (error) {
    return res.status(400).send({ success: false, error});
  }
}


exports.sendMail = async (req,res)=>{
    const{mail , title,  message } = req.body
    try {
        const transporter = await nodemailer.createTransport({
            service: SERVICE,
            auth: {
                user: GMAILNAME,
                pass: GMAILPASSWORD,
            }
        });
        await transporter.sendMail({
            from: GMAILNAME,
            to: mail,
            subject: title,
            text: message,
        }, (err , success)=>{
            if(err){
                return res.status(400).send({ success: false, err});
            }else {
                return res.status(200).send({ success: true , success});
            }
        });
    } catch (error) {
        return res.status(400).send({ success: false, error});
    }
   

}

    