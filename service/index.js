const userService = require('./service.user')
const surveyService = require('./service.survey')
const loginService = require('./service.login')
const reportTotalAnswersService = require('./service.reportTotalAnswers')

const companyService = require('./service.company')
const buildingService = require('./service.building')
const questionService = require('./service.question')
const adminCreateService = require('./service.adminCreate')
const countryService = require('./service.country')

module.exports = {
     userService, surveyService, questionService,
     loginService, reportTotalAnswersService, companyService, buildingService, adminCreateService, countryService
}