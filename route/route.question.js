const express = require("express")
const router = express.Router();
const { questionController } = require('../controller')


router.post('/createQuestion', questionController.createQuestion);
router.post('/createOptionChoice', questionController.createOptionChoice);

module.exports = router

