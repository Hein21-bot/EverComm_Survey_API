const userService = require('./service.user')
const surveyService = require('./service.survey')
const loginService = require('./service.login')
const reportTotalAnswersService = require('./service.reportTotalAnswers')

const companyService = require('./service.company')
const buildingService = require('./service.building')

module.exports = {
     userService, surveyService,
     loginService, reportTotalAnswersService, companyService, buildingService
}