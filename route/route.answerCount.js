const { answerCountController } = require('../controller')
const express = require("express")
const router = express.Router()

router.get('/answerCount/:surveyHeaderId', answerCountController.answerCount);


module.exports = router