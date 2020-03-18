const { answerCountController } = require('../controller')
const express = require("express")
const router = express.Router()

router.post('/answerCount', answerCountController.answerCount);

module.exports = router