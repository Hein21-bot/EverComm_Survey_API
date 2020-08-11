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
    const user_level = req.body.user_level
    const companyName = req.body.companyName
    const phone_number = req.body.phone_number


    userService.checkDuplicateEmailInsert(email)
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

                    userService.addUser(userName, hash, email, active, user_level, companyName, phone_number)
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

                    userService.updateUser(userId, userName, hash, email)
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
                })
            }
        })
        .catch(err => {
            res.json(response({ success: false, message: err }));
        });
};

const getUser = (req, res) => {
    userService.getUser().then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}



module.exports = { getAdmin, addUser, updateUser, getUser }
