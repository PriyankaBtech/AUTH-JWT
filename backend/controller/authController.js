const userModel = require("../model/userSchema")
const emailValidator = require('email-validator')

const signup = async (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body
    console.log(name, email, password, confirmPassword)

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }

    const validEmail = emailValidator.validate(email)
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: "Please provide valid email id"
        })            
    }
    
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "password and confim password doesn't match"
        })         
    }

    try {
        const userInfo = userModel(req.body)
        // directly store in database
        const result = await userInfo.save()
    
        return res.status(200).json({
            success: true,
            date: result
        })

        
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Account already exists with provided email id'
            })            
        }

        return res.status(400).json({
            success: false,
            message: error.message
        })
        
    }
}

module.exports = {
    signup
}