const { surveydb } = require('../db')

const getAdmin = () => {
    return surveydb.getAdmin();
}

const addCompany = (companyName) => {
    return surveydb.addCompany(companyName)
}

const addUser = (userName, password, email, companyName) => {
    return surveydb.addUser(userName, password, email, companyName)

}

// @HMH

const updateUser = (userId, userName, password, email, companyId) => {
    return surveydb.updateUser(userId, userName, password, email, companyId)
}

const checkDuplicateEmailInsert = (email) => {
    return surveydb.checkDuplicateEmailInsert(email);
}

const checkDuplicateEmailUpdate = (email, user_id) => {
    return surveydb.checkDuplicateEmailUpdate(email, user_id);
}



module.exports = { getAdmin, addUser, checkDuplicateEmailInsert, checkDuplicateEmailUpdate, updateUser,  addCompany }
