const {authController} = require('../controller')
const express = require("express")
const router = express.Router()

router.post('/login',authController.logIn);

module.exports = router