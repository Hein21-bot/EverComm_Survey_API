const { userService } = require('../service')
const response = require('../model/response')
const { surveydb } = require('../db')
const bcrypt = require("bcrypt")
const saltRounds = 10


const getAdmin = (req, res) => {
    userService.getAdmin().then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

const getCompany = (req, res) => {
    userService.getCompany().then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

const addUser = (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    const email = req.body.email
    const companyName = req.body.companyName


    userService.checkDuplicateEmailInsert(email)
        .then(data => {
            console.log("controller email is ===>", email);

            const DuplicateRows = data[0].DE;
            if (DuplicateRows > 0) {
                res.json(
                    response({
                        success: false,
                        payload: null,
                        message: "Email Already Exist"
                    })
                );
            } else {
                bcrypt.hash(password, saltRounds, function (err, hash) {

                    userService.addUser(userName, hash, email, companyName)
                        .then(data => {
                            console.log("controller data is ===>", data);

                            res.json(
                                response({
                                    success: true,
                                    message: "Inserted!",
                                    payload: data
                                })
                            );
                        }).catch(err => {
                            res.json(response({ success: false, message: err }));
                        });
                })
            }
        })
        .catch(err => {
            res.json(response({ success: false, message: err }));
        });
};

// @HMH

const updateUser = (req, res) => {
    const userId = req.params.user_id
    const userName = req.body.userName
    const password = req.body.password
    const email = req.body.email
    const companyName = req.body.companyName

    userService.checkDuplicateEmailUpdate(email, userId)
        .then(data => {
            const DuplicateRows = data[0].DE;
            if (DuplicateRows > 0) {
                res.json(
                    response({
                        success: false,
                        payload: null,
                        message: "Email Already Exist"
                    })
                );
            } else {
                userService.updateUser(userId, userName, password, email, companyName)
                    .then(data => {
                        res.json(
                            response({
                                success: true,
                                message: "Inserted!",
                                payload: data
                            })
                        );
                    }).catch(err => {
                        res.json(response({ success: false, message: err }));
                    });
            }
        })
        .catch(err => {
            res.json(response({ success: false, message: err }));
        });
};



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

module.exports = { getAdmin, addUser, updateUser, getCompany }
// ,addAdmin,updateAdmin,getAdminById