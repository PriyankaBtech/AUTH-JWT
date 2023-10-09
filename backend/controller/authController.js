const userModel = require("../model/userSchema")
const emailValidator = require('email-validator')

// sign-up
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

// sign-in
const signin = async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is mandatory"
        })        
    }

    try {
        // check the entered email id exists in DB or not
        const user = await userModel
            .findOne({
               email
        })
        .select('+password')

        if (!user || user.password !== password) {
            return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        })         
    }

    const token = user.jwtToken()
    user.password = undefined

    const cookieOption = {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true    
    }

    res.cookie("token", token, cookieOption)
    res.status(200).json({
        success: true,
        data: user 
    })
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message 
        })        
    }
}

// get-user | user information
const getUser = async (req, res, next) => {
    const userId = req.user.id

    try {
        const user = await userModel.findById(userId)
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message 
        })        
    }
}

// logout
const logout = (req, res) => {

    try {
        const cookieOption = {
            expires: new Date(),
            httpOnly: true
        }
        res.cookie("token", null, cookieOption)
        res.status(200).json({
            sucess: true,
            message: "successfully logged-out"
        })
        
    } catch (error) {
        res.status(400).json({
            sucess: false,
            message: error.message
        })        
    }
}

module.exports = {
    signup,
    signin,
    getUser,
    logout
}