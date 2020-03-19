const { loginService } = require('../service')
const response = require('../model/response')
var groupArray = require('group-array');

const logIn = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    loginService.login(email, password).then(data => {
        if (data.length === 0) {
            res.json(response({ success: false, message: "Email or Password Incorrect!", payload: null }))
        }
        else {
            res.json(response({ success: true, message: "Success", payload: data}))
        }
    }).catch(err => console.log(err))
};

module.exports = { logIn }
