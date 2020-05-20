const { surveydb } = require('../db')
const { produceToken } = require('../security/token')
const bcrypt = require("bcrypt")
const response = require('../model/response')

const login = (email, password, callbackWhenDone) => {
    return surveydb.login(email, password).then(res => {

        if (res.length) {
            const hash = res[0].password.toString()

            return bcrypt.compare(password, hash, function (err, response) {
                if (response === true) {
                    const payload = {
                        email: res[0].email,
                        password: res[0].password
                    }
                    const token = produceToken(payload)
                    const data = {
                        token: token,
                        login_user_id: res[0].login_user_id,
                        email: res[0].email
                    }
                    return callbackWhenDone(null, data)
                } else {
                    return callbackWhenDone(null, false)
                }
            })

        }
        else {
            return callbackWhenDone(null, false)
        }
    }).catch(err => (response({ error: err,success: false, message: dotCatchError })))
}


module.exports = { login }

