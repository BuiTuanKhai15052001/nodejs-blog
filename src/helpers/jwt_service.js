const JWT = require('jsonwebtoken')
const createError = require('http-errors');


const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        // const secret = process.env.ACCESS_TOKEN_SECRET;
        const secret = '83e5e23e73b4411f706d8ee52ed510572d0bfc82d9f0cc0658f251393d67459a'
        const options = {
            expiresIn: '1h'
        }
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return next(createError.Unauthorized())
    }
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    //verify TOKEN
    JWT.verify(token, '83e5e23e73b4411f706d8ee52ed510572d0bfc82d9f0cc0658f251393d67459a', (err, payload) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return next(createError.Unauthorized())
            }
            return next(createError.Unauthorized(err.message))
        }
        req.payload = payload;
        next()
    })
}



const signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {


        const payload = {
            userId
        }
        // const secret = process.env.REFRESH_TOKEN_SECRET;
        const secret = 'ede44f97ff178eb131f4b888e5f7acbc41b2037c2bb7d0be12b86ded99bfb285'
        const options = {
            expiresIn: '1y'
        }
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, 'ede44f97ff178eb131f4b888e5f7acbc41b2037c2bb7d0be12b86ded99bfb285', (err, payload) => {
            if (err) {
                return reject(err);
            }
            resolve(payload)

        })

    })

}

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken
}