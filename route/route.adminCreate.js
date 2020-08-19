const express = require("express")
const router = express.Router();
const { adminCreateController } = require('../controller')


router.post('/Survey', adminCreateController.surveyHeader);

module.exports = router
