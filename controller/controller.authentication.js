const { authService } = require('../service')
const response = require('../model/response')


const logIn = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    authService.login(username, password).then(data => {

        
        if (data.length == 0) {
            res.json(response({ success: false, message: "user name and password does not match" }));
        }
        else {
            res.json(response({ success: true, payload: data }));
        }
    }).catch(err => res.json(response({ success: false, message: err })));
}

module.exports = { logIn }
