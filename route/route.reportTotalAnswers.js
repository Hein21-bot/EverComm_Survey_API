const { reportTotalAnswersController } = require('../controller')
const express = require("express")
const router = express.Router()


router.post('/reportTotalAnswers/:surveyHeaderId', reportTotalAnswersController.userLevelAnswer);
router.post('/reportMenu/:userId', reportTotalAnswersController.userLevelMenuAnswer);
router.post('/graphReportUserLevel', reportTotalAnswersController.graphReportApiUserLevel);
router.get('/chiller', reportTotalAnswersController.chiller);

module.exports = router