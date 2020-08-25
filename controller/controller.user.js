const { userService, companyService } = require('../service')
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
    const active = 1
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
                            if (req.body.surveyHeaderId == undefined || req.body.surveyHeaderId.length == 0) {
                                return data
                            } else if (req.body.surveyHeaderId.length > 0) {
                                userService.userSurveyPermession(data.insertId, req.body.surveyHeaderId).then(data1 => {
                                    res.json(
                                        response({
                                            success: true,
                                            message: "Inserted!",
                                            payload: data1
                                        })
                                    )
                                }).catch(err1 => { throw err1 })
                            }
                        }).catch(err => {
                            res.json(response({ success: false, message: err.code, error: err }));
                        });
                })
            }
        })
        .catch(err => {
            res.json(response({ success: false, message: err.code, error: err }));
        });
};

// @HMH

const updateUser = (req, res) => {
    const userId = req.params.user_id
    const userName = req.body.userName
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

                userService.updateUser(userId, userName, email, active, user_level, companyName, phone_number)
                    .then(data => {
                        res.json(
                            response({
                                success: true,
                                message: "Insert!",
                                payload: data
                            }),
                        )
                        if (req.body.surveyHeaderId == undefined || req.body.surveyHeaderId.length == 0) {
                            return data
                        } else if (req.body.surveyHeaderId.length > 0) {
                            userService.removePermsession(userId);
                            userService.userSurveyPermession(userId, req.body.surveyHeaderId).then(data1 => {

                            }).catch(err1 => { throw err1 })
                        }
                    })
            }
        })
        .catch(err => {
            res.json(response({ success: false, error: err, message: "Fail!" }));
        });
};

const getUser = (req, res) => {
    const user_id = req.params.user_id
    userService.getUser(user_id).then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err.toString() })));
}

const userSurveyPermession = (req, res, uId) => {
    const user_id = req.params.user_id || uId
    const data = req.body.surveyHeaderId

    return userService.userSurveyPermession(user_id, data)
        .then(result => {
            res.json(response({
                success: true,
                message: "Success",
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

const getOneUserInfo = (req, res) => {
    const user_id = req.params.user_id

    return userService.getOneUserInfo(user_id)
        .then(data => {
            res.json(response({
                success: true,
                message: "success",
                payload: data
            }))
        })
        .catch(error => {
            res.json(response({
                success: false,
                error: error
            }))
        })
}

const userEdit = (req, res) => {
    const user_id = req.params.user_id
    const password = req.body.password
    const editPassword = req.body.editPassword

    return bcrypt.hash(editPassword, saltRounds, function (err, hash) {
        return userService.userEdit(user_id, password, hash).then(data => {
            if (err) {
                res.json(response({ success: false, message: err, payload: null }))
            } else {

                if (data === false) {
                    res.json(response({ success: false, message: "Password Incorrect!", payload: null }))
                } else {
                    res.json(
                        response({
                            success: true,
                            message: "Password Edit Successful!",
                            payload: data
                        })
                    )
                }
            }
        })
    })


}


module.exports = { getAdmin, addUser, updateUser, getUser, userSurveyPermession, getOneUserInfo, userEdit }
