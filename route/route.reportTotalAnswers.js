const { reportTotalAnswersController } = require('../controller')
const express = require("express")
const router = express.Router()


router.post('/totalReportAnswers/:surveyHeaderId', reportTotalAnswersController.userLevelAnswer);

module.exports = router