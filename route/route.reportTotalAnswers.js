const { reportTotalAnswersController } = require('../controller')
const express = require("express")
const router = express.Router()

// router.post('/reportTotalAnswers/:surveyHeaderId', reportTotalAnswersController.reportTotalAnswers);
// router.post('/reportDateTimeAnswers/:surveyHeaderId', reportTotalAnswersController.reportDateTimeAnswers);
router.post('/totalReportAnswers/:surveyHeaderId', reportTotalAnswersController.userLevelAnswer);

module.exports = router