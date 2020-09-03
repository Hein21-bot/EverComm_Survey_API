const { countryController } = require('../controller')
const express = require("express")
const router = express.Router()

router.post('/addCountry', countryController.addCountry);
router.get('/getCountry/:surveyHeaderId', countryController.getCountry)
router.get('/getCountrySurvey/:surveyHeaderId', countryController.getCountrySurvey)

module.exports = router