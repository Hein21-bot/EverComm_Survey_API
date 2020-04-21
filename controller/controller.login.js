const { loginService } = require('../service')
const response = require('../model/response')
const { verifyToken } = require('../security/token')


const logIn = (req, res) => {
    const email = req.body.email
    const password = req.body.password  

    loginService.login(email, password, (error, data) => {
        if(error) {
            console.log("error: ", error)
            res.json(response({ success: false, message: error, payload: null }))
        }
        console.log("Data is ==>", data)
        if (data === false) {
            res.json(response({ success: false, message: "Email or Password Incorrect!", payload: null }))
        } else {
            res.json(response({ success: true, message: "Login success", payload: [data] }))
        }
    })
};

module.exports = { logIn }
