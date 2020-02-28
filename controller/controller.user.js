const { userService } = require('../service')
const response = require('../model/response')
const { surveydb } = require('../db')

const getAdmin = (req, res) => {
    userService.getAdmin().then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

// const addAdmin = (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const active = req.body.active;
//     const employeeId = req.body.employeeId;

//     surveydb.isExistAdmin(username, 0).then(data => {
//         if (data.length) {
//             res.json(response({ success: false, message: "duplicate name" }))
//         }
//         else {
//             userService.addUser(username, password, active, employeeId).then(data => {
//                 res.json(response({ success: true }))
//             }).catch(err => response({ success: false, err: err }))
//         }
//     }).catch(err => response({ success: false, err: err }))
// }

// const getAdminById = (req, res) => {
//     const userId = req.params.id;
//     userService.getUserById(userId).then(data => {
//         res.json(response({ success: true, payload: data }))
//     }).catch(err => res.json(response({ success: false, message: err })));
// }

// const updateAdmin = (req, res) => {
//     const userId = req.params.id;
//     const username = req.body.username;
//     const password = req.body.password;
//     const active = req.body.active;
//     const employeeId = req.body.employeeId;

//     surveydb.isExistAdmin(username, userId).then(data => {
//         if (data.length) {
//             res.json(response({ success: false, message: "duplicate name" }))
//         }
//         else {
//             userService.updateAdmin(userId,username, password, active, employeeId).then(data => {
//                 res.json(response({ success: true }))
//             }).catch(err => response({ success: false, err: err }))
//         }
//     }).catch(err => response({ success: false, err: err }))
// }

module.exports = {getAdmin}
// ,addAdmin,updateAdmin,getAdminById