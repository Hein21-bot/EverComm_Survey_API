const express = require("express")
const router = express.Router();
const { adminCreateController } = require('../controller')


router.post('/Survey/:user_id', adminCreateController.surveyHeader);
router.put('/SurveyEdit/:user_id', adminCreateController.surveyHeaderEdit);

module.exports = router
