const { surveydb } = require('../db')
const bcrypt = require('bcrypt')

const getAdmin = (user_id) => {
    return surveydb.getAdmin(user_id);
}

const addCompany = (companyName) => {
    return surveydb.addCompany(companyName)
}

const addUser = (userName, password, email, active, user_level, companyName, phone_number) => {
    return surveydb.addUser(userName, password, email, active, user_level, companyName, phone_number)

}

// @HMH

const updateUser = (userId, userName, email, active, user_level, companyName, phone_number) => {
    return surveydb.updateUser(userId, userName, email, active, user_level, companyName, phone_number)
}

const checkDuplicateEmailInsert = (email) => {
    return surveydb.checkDuplicateEmailInsert(email);
}

const checkDuplicateEmailUpdate = (email, user_id) => {
    return surveydb.checkDuplicateEmailUpdate(email, user_id);
}

const getUser = (user_id) => {
    return surveydb.getAdmin(user_id).then(data => {
        if (data.length > 0) {
            return surveydb.getUser()
                .then(data => {
                    if (data.length > 0) {
                        const result = data[0].reduce((r, c) => {
                            const R = [...r]
                            const index = R.findIndex(v => v.id == c.login_user_id)
                            if (index === -1) {
                                R.push({
                                    id: c.login_user_id, name: c.user_name, email: c.email, active: c.active, role: c.role, companyName: c.company_name, phone_number: c.phone_number,
                                    survey_header_id: c.survey_header_id == null ? null : [c.survey_header_id]
                                })
                            }
                            else {
                                R[index].survey_header_id.push(c.survey_header_id)
                            }
                            return R
                        }, [])
                        return [result, data[1]]
                    } else return []
                })
                .catch(error => {
                    throw error
                })
        } else {
            return []
        }
    }).catch(error => {
        throw error
    })
}


const userSurveyPermession = async (uId, data) => {
    const resultArr = []
    try {
        for (let i = 0; i < data.length; i++) {
            const d = data[i]
            const saveResult = await surveydb.userSurveyPermession(uId, d)
            resultArr.push(saveResult)
        }
        return resultArr

    }
    catch (error) {
        throw error
    }

}


const removePermsession = (user_id) => {
    return surveydb.removePermsession(user_id)
}

const getOneUserInfo = (user_id) => {
    return surveydb.getOneUserInfo(user_id)
}

const userEdit = (user_id, password, editPassword) => {
    return surveydb.userEdit(user_id).then(res => {
        //(results.length && bcrypt.compareSync(password, results[0].password))
        const result = res[0]
        if (res.length > 0) {
            const hash = result.password.toString()
            return bcrypt.compare(password, hash, function (err, response) {
                if (response == true) {
                    console.log("enter this response",response)
                   return  surveydb.userPasswordEdit(user_id, editPassword).then(resultedData=>{
                       console.log("enter this",resultedData)
                        return resultedData

                    }).catch(error=>{
                        throw error
                    })

                } else {
                    console.log("enter response false")
                    return []
                }
            })
        } else {
            return []
        }
    }).catch(error => {
        throw error
    })
}

module.exports = { getAdmin, addUser, checkDuplicateEmailInsert, checkDuplicateEmailUpdate, updateUser, addCompany, getUser, userSurveyPermession, removePermsession, getOneUserInfo, userEdit }
