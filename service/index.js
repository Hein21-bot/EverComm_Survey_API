const authService = require('./service.authentication')
const userService = require('./service.user')
const reportService = require('./service.report')
const surveyService = require('./service.survey')
const loginService = require('./service.login')
const reportTotalAnswersService = require('./service.reportTotalAnswers')

const formService = require('./service.form')
const companyService = require('./service.company')
const buildingService = require('./service.building')

module.exports = {
     authService, userService, reportService, surveyService,
     loginService, reportTotalAnswersService, formService, companyService, buildingService
}