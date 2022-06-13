const mongoDb = require('mongoose');
// const bcrypt = require('bcrypt');

const schema = mongoDb.Schema;

const employeeSchema = new schema({
    profile: {
        type: String,
    },
    employeeTitle: {
        type: String,
        enum: ['frontend developer', 'backend developer' , 'ai developer'],
        default : "developer"
    },
    name: {
        type: String,
        required: true
    },
    mail: {
        unique: true,
        lowercase : true,
        required: true,
        type: String,
        validate:{
            validator:function(mail){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
            },
            message : "please fill a valid mail",
        }
    },
    phone: {
        unique: true,
        required: true,
        type: String,
        validate:{
            validator:function(mail){
                return /\d{3}-\d{3}-\d{4}/.test(mail);
            },
            message : "please provide phone number in a given formate",
        }
    },
    status: {
        type: Boolean,
        default: false
    },
    },
    {strict : false}
)

// userSchema.pre('save', async function (next) {
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// })

const model = new mongoDb.model('employee', employeeSchema)

module.exports = model;