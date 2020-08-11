const express = require("express")
const router = express.Router();
const { userController } = require('../controller')


router.post('/register', userController.addUser);
router.put('/updateUser/:user_id', userController.updateUser);
router.get('/getUser', userController.getUser)


module.exports = router