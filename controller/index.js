const userController = require('./controller.user')
const surveyController = require('./controller.survey')
const loginController = require('./controller.login')
const reportTotalAnswersController = require('./controller.reportTotalAnswers')

const buildingController = require('./controller.building')
const companyController = require('./controller.company')
const questionController = require('./controller.question')
const adminCreateController = require('./controller.adminCreate')


module.exports = {
    userController, surveyController,
    loginController, reportTotalAnswersController,
    buildingController, companyController,
    questionController, adminCreateController
}