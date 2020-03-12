const express = require("express")
const router = express.Router();
const {userController} = require('../controller')
// router.post('/adduser',userController.addUser);
// router.get('/getuser', userController.getUser);
// router.get('/getuserbyid/:id', userController.getUserById);
// router.put('/updateuser/:id', userController.updateUser);

router.get('/admins', userController.getAdmin);
router.post('/adduser', userController.addUser);

module.exports = router