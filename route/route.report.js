const express = require("express")
const router = express.Router();
const { reportController } = require('../controller')

router.post('/getsurvey', reportController.getOpening);

module.exports = router