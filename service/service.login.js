const { surveydb } = require('../db')

const login = (email, password) => {
    return surveydb.login(email, password);
}


module.exports = { login }