const userModel = require("../model/userSchema")

const signup = async (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body
    console.log(name, email, password, confirmPassword)

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