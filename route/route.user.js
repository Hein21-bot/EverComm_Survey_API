const express = require("express")
const router = express.Router();
const { userController } = require('../controller')

router.get('/admins', userController.getAdmin);
router.post('/register', userController.addUser);
router.put('/:user_id', userController.updateUser);
router.get('/companies', userController.getCompany)

module.exports = router