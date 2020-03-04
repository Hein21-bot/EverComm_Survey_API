const express = require("express")
const router = express.Router();
const { surveyController } = require('../controller')

router.get('/questions/:admin_id/:survey_header_id', surveyController.getQuestion);
router.post('/answers',surveyController.addAnswer);

module.exports = router