const express = require("express")
const router = express.Router();
const { surveyController } = require('../controller')

router.get('/questions/:admin_id/:survey_header_id/:buildingId', surveyController.getQuestion);
router.post('/answers', surveyController.addAnswer);
router.get('/menu/:user_id', surveyController.getMenu);
router.get('/surveyList/:user_id/:survey_header_id', surveyController.surveyList);
router.get('/newSurveyList/:user_id/:survey_header_id', surveyController.newSurveyList);
router.get('/surveyMenu/:user_id', surveyController.surveyMenuApi);
router.post('/dateTimeReportMenu/:user_id', surveyController.dateTimeMenuApi);

router.delete('/:user_id/:survey_header_id/:building_id', surveyController.deleteAnswer)

module.exports = router