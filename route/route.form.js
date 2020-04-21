const express = require("express")
const router = express.Router();
const { formController } = require('../controller')

router.get('/:companyId', formController.getFormInfo);

module.exports = router