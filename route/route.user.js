const express = require("express")
const router = express.Router();
const { userController } = require('../controller')


router.post('/register', userController.addUser);
router.put('/:user_id', userController.updateUser);


module.exports = router