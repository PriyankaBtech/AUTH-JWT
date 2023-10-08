const JWT = require('jsonwebtoken')

const jwtAuth = (req, res, next) => {

    const token = (req.cookies && req.cookies.token) || null
    next()

    if(!token) {
        return res.status(400).json({
            success: false,
            message: "Not Authorized"
        })
    }
    try {
        const payload = JWT.verfiy(token, process.env.SECRET)
        req.user = {id: payload.id, email: payload.email}

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
        
    }
}

module.exports = jwtAuth