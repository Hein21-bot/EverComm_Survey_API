const {surveydb} = require('../db')

const getAdmin = () =>{
    return surveydb.getAdmin();
}

const addUser = (name) =>{
    return surveydb.addUser(name);
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

module.exports = {getAdmin,addUser}
// ,addAdmin,updateAdmin,getAdminById