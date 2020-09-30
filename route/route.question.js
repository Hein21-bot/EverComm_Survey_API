const express = require("express")
const router = express.Router();
const { questionController } = require('../controller')


router.post('/createQuestion', questionController.createQuestion);

module.exports = router

