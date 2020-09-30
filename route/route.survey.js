const express = require("express")
const router = express.Router();
const { surveyController } = require('../controller')

router.post('/questions', surveyController.getQuestion);
router.post('/answers', surveyController.addAnswer);
router.get('/surveyList/:user_id/:survey_header_id', surveyController.surveyList);

router.get('/surveySectionList/:surveyHeaderId/:countryId',surveyController.sectionList)

router.get('/surveyMenu/:userId', surveyController.surveyMenuApi);

router.delete('/:user_id/:survey_header_id/:building_id', surveyController.deleteAnswer)

module.exports = router