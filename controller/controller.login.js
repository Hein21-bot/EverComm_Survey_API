const { loginService } = require('../service')
const response = require('../model/response')
const { verifyToken } = require('../security/token')


const logIn = (req, res) => {
    const email = req.body.email
    const password = req.body.password 

    loginService.login(email, password, (err, data) => {
        if(err) {
            res.json(response({ success: false, message: err, payload: null }))
        }
        if (data === false) {
            res.json(response({ success: false, message: "Email or Password Incorrect!", payload: null }))
        } else {
            res.json(response({ success: true, message: "Login success", payload: [data] }))
        }
    })
};

module.exports = { logIn }
