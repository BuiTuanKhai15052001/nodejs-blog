
const Users = require('../models/User.model');

const { mutipleMongooseToObject } = require('../../util/mongoose');

class UserController {
  
    //[GET] / search
    search(req, res) {
        res.render('users/register');
    }
    login(req, res){
        res.render('users/login')
    }

};
module.exports = new UserController();