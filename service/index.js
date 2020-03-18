const authService = require('./service.authentication')
const userService = require('./service.user')
const reportService = require('./service.report')
const surveyService = require('./service.survey')
const loginService = require('./service.login')
const answerCountService = require('./service.answerCount')

module.exports = { authService, userService, reportService, surveyService, loginService, answerCountService }