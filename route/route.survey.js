const express = require("express")
const router = express.Router();
const { surveyController } = require('../controller')

router.get('/questions/:admin_id/:survey_header_id/:buildingId', surveyController.getQuestion);
router.post('/answers', surveyController.addAnswer);
// router.get('/menu/:userId', surveyController.getMenu);
router.get('/surveyList/:user_id/:survey_header_id', surveyController.surveyList);

router.get('/surveyMenu/:userId', surveyController.surveyMenuApi);
// router.post('/dateTimeReportMenu/:userId', surveyController.userLevelMenuAnswer);

router.delete('/:user_id/:survey_header_id/:building_id', surveyController.deleteAnswer)

module.exports = router