const { surveydb } = require('../db')
const { produceToken } = require('../security/token')

const login = (username, password) => {
    return surveydb.login(username, password).then(res => {
        if (res.length) {
            const payload = {
                name: res[0].username,
                active: res[0].employeeName,
            }
            const token = produceToken(payload);
            const data = {
                token: token,
                userId: res[0].userId,
                employeeId: res[0].employeeId,
                employeeName: res[0].employeeName,
                employeeImage: res[0].employeeImage,
                designation: res[0].designation
            }
            return data
        }
        else {
            return []
        }
    }).catch(err => {
        console.log(err)
    })

}

module.exports = { login }