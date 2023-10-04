const express = require('express');
const route = express.Router();
const createError = require('http-errors');
const User = require('../app/models/User.model')
const UserController = require('../app/controllers/UserController')
const { userValidate } = require('../helpers/validation')
const { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_service')

route.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log("req.body:: ", req.body);
        const { error } = userValidate(req.body);
        

        if (error) {
            throw createError(error.details[0].message)
        }
        const isExists = await User.findOne({
            username: email
        })
        if (isExists) {
            throw createError.Conflict(`${email} is exist!!`)
        }

        const user = new User({
            username: email, password
        })
        const saveUser = await user.save();

        saveUser && res.redirect('/user/user-login')
        console.log("Register OKKKKK");
    } catch (error) {
        next(error);

    }
})
route.post('/refresh-token', async (req, res, next) => {

    try {
        console.log(req.body);
        const { refreshToken } = req.body;
        const { userId } = await verifyRefreshToken(refreshToken);
        const accessToken = await signAccessToken(userId);
        const refrToken = await signRefreshToken(userId)
        res.json({
            accessToken,
            refreshToken: refrToken
        })

    } catch (error) {
        next(error)
    }



})
route.post('/login', async (req, res, next) => {
    try {
        const { error } = userValidate(req.body);
        if (error) {
            throw createError(error.details[0].message)
        }
        const { email, password } = req.body
        const user = await User.findOne({
            username: email
        });
        if (!user) {
            throw createError.NotFound('User is not register')
        }
        const isValid = await user.isCheckPassword(password);
        if (!isValid) {
            throw createError.Unauthorized('Password is not correct!!!')
        }

        isValid && res.render('/', {email})
        
        // const accessToken = await signAccessToken(user._id)
        // const refreshToken = await signRefreshToken(user._id)

        console.log('Login OKKKKK');

    } catch (error) {
        next(error)
    }
})
route.post('/logout', (req, res, next) => {
    res.send('Function logout')
})

route.get('/user-register', UserController.search)
route.get('/user-login', UserController.login)




module.exports = route



