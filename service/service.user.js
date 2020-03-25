const { surveydb } = require('../db')

const getAdmin = () => {
    return surveydb.getAdmin();
}

const addUser = (userName, password, email) => {
    return surveydb.addUser(userName, password, email)
}

// @HMH

const updateUser = (userId, userName, password, email) => {
    return surveydb.updateUser(userId, userName, password, email)
}

const checkDuplicateEmailInsert = (email) => {
    return surveydb.checkDuplicateEmailInsert(email);
}

const checkDuplicateEmailUpdate = (email, user_id) => {
    return surveydb.checkDuplicateEmailUpdate(email, user_id);
}

// const addAdmin = (username, password, active, employeeId) => {
//     return surveydb.addUser(username,password,active,employeeId)
// }

// const getAdminById = (userId) =>{
//     return surveydb.getUserById(userId);
// }

// const updateAdmin = (userId,username, password, active, employeeId) => {
//     return surveydb.updateAdmin(userId,username, password, active, employeeId);
// }

module.exports = { getAdmin, addUser, checkDuplicateEmailInsert,checkDuplicateEmailUpdate, updateUser }
// ,addAdmin,updateAdmin,getAdminById