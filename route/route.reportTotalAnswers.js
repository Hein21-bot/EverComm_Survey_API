const { reportTotalAnswersController } = require('../controller')
const express = require("express")
const router = express.Router()

router.get('/reportTotalAnswers/:surveyHeaderId/:surveySectionId', reportTotalAnswersController.reportTotalAnswers);


module.exports = router