const userRouter = require('./route.user')
const loginRouter = require('./route.login')
const surveyRouter = require('./route.survey')

const buildingRouter = require('./route.building')
const adminCreateRouter = require('./route.adminCreate')

const reportTotalAnswersRouter = require('./route.reportTotalAnswers')
const questionRouter = require('./route.question')
const express = require('express')
const { routeMiddleware } = require('../middleware/middleware.authorization')
const router = express.Router()

router.use('/login', loginRouter)
router.use('/user', userRouter)
// router.use(routeMiddleware)

router.use('/survey', surveyRouter)
router.use('/report', reportTotalAnswersRouter)

router.use('/question', questionRouter)

router.use('/building', buildingRouter)

router.use('/createSurvey', adminCreateRouter)


module.exports = router
