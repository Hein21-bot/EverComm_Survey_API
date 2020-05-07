const { reportTotalAnswersController } = require('../controller')
const express = require("express")
const router = express.Router()

router.post('/reportTotalAnswers/:surveyHeaderId', reportTotalAnswersController.reportTotalAnswers);


module.exports = router