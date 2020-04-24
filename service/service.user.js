const { surveydb } = require('../db')

const getAdmin = () => {
    return surveydb.getAdmin();
}

const addCompany = (companyName) => {
    return surveydb.addCompany(companyName)
}

const addUser = (userName, password, email, companyName) => {
    console.log("service is ====>",userName, password, email, companyName);    
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

const getCompany = () => {
    return surveydb.getCompany();
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

module.exports = { getAdmin, addUser, checkDuplicateEmailInsert, checkDuplicateEmailUpdate, updateUser, getCompany, addCompany }
// ,addAdmin,updateAdmin,getAdminById