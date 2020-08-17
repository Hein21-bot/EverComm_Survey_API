const express = require("express")
const router = express.Router();
const { userController } = require('../controller')


router.get('/getUser/:user_id', userController.getUser)
router.get('/getOneUser/:user_id', userController.getOneUserInfo)
router.post('/register', userController.addUser);
router.put('/updateUser/:user_id', userController.updateUser);
router.put('/editUser/:user_id', userController.userEdit)
router.post('/surveyPermession/:user_id', userController.userSurveyPermession)


module.exports = router