const authController = require('./controller.authentication')
const userController = require('./controller.user')
const reportController = require('./controller.report')
const surveyController = require('./controller.survey')
const loginController = require('./controller.login')
const reportTotalAnswersController = require('./controller.reportTotalAnswers')

const formController = require('./controller.form')
const buildingController = require('./controller.building')
const companyController = require('./controller.company')


module.exports = {
    authController, userController, reportController,
    surveyController, loginController, reportTotalAnswersController, formController,
    buildingController, companyController
}