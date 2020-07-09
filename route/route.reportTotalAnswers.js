const { reportTotalAnswersController } = require('../controller')
const express = require("express")
const router = express.Router()


router.post('/reportTotalAnswers/:surveyHeaderId', reportTotalAnswersController.userLevelAnswer);
router.post('/reportMenu/:userId', reportTotalAnswersController.userLevelMenuAnswer);
router.get('/typeAndArea', reportTotalAnswersController.typeAndArea);
// router.get('/typeAndBMS', reportTotalAnswersController.typeAndBMS);
// router.get('/age', reportTotalAnswersController.age);
router.get('/graphReportApi', reportTotalAnswersController.graphReportApi);

module.exports = router