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



const addUser = (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    const email = req.body.email
    const active = req.body.active == true ? 1 : 0
    const user_level = req.body.user_level || 2
    const companyName = req.body.companyName
    const phone_number = req.body.phone_number

    return userService.checkDuplicateEmailInsert(email)
        .then(data => {
            const DuplicateRows = data[0][0].DE;
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

                    userService.addUser(userName, hash, email, active, user_level, companyName, phone_number)
                        .then(data => {
                            res.json(
                                response({
                                    success: true,
                                    message: "Inserted!",
                                    payload: data
                                })
                            )
                            if (req.body.surveyHeaderId == undefined) {
                                return data
                            } else if (req.body.surveyHeaderId.length > 0) {
                                userService.userSurveyPermession(data.insertId, req.body.surveyHeaderId).then(data1 => {
                                }).catch(err1 => { throw err1 })
                            }
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
    const active = req.body.active == true ? 1 : 0
    const user_level = req.body.user_level
    const companyName = req.body.companyName
    const phone_number = req.body.phone_number

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
                
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    userService.updateUser(userId, userName, hash, email, active, user_level, companyName, phone_number)
                        .then(data => {
                            res.json(
                                response({
                                    success: true,
                                    message: "Inserted!",
                                    payload: data
                                })
                            );
                            if (req.body.surveyHeaderId == undefined) {
                                return data
                            } else if (req.body.surveyHeaderId.length > 0) {
                                userService.userSurveyPermession(userId, req.body.surveyHeaderId).then(data1 => {
                                }).catch(err1 => { throw err1 })
                            }
                        })
                        .catch(err => {
                            res.json(response({ success: false, error: err, message: "Fail!" }));
                        });
                })
            }
        })
        .catch(err => {
            res.json(response({ success: false, error: err, message: "Fail!" }));
        });
};

const getUser = (req, res) => {
    userService.getUser().then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

const userSurveyPermession = (req, res, uId) => {
    const user_id = req.body.user_id || uId
    const data = req.body.surveyHeaderId
    userService.removePermsession(uId || req.body.data[0].user_id);
    return userService.userSurveyPermession(user_id, data)
        .then(result => {
            res.json(response({
                success: true,
                payload: result
            }))
        })
        .catch(error => {
            res.json(response({
                success: false,
                error: error
            }))
        })
}


module.exports = { getAdmin, addUser, updateUser, getUser, userSurveyPermession }
