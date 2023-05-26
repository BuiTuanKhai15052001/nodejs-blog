const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');


const UserSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        unipue: true,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})


UserSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.isCheckPassword = function (password) {
    try {
        return bcrypt.compare(password, this.password)
    } catch (error) {
        
    }
}

const UserModel = mongoose.model('users', UserSchema)
module.exports = UserModel