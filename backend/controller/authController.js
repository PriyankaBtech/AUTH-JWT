
const signup = (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body 

    return res.status(200).json({
        success: true,
        date: {}
    })

}

module.exports = {
    signup
}