const authController = require('./controller.authentication')
const userController = require('./controller.user')
const reportController = require('./controller.report')
const surveyController = require('./controller.survey')
const loginController = require('./controller.login')
const answerCountController = require('./controller.answerCount')

const formController = require('./controller.form')
const buildingController = require('./controller.building')
const companyController = require('./controller.company')


module.exports = { authController, userController, reportController, 
    surveyController, loginController, answerCountController,formController,
    buildingController,companyController }