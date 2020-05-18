const userRouter = require('./route.user')
const loginRouter = require('./route.login')
const surveyRouter = require('./route.survey')
const companyRouter = require('./route.company')
const buildingRouter = require('./route.building')
const commentRouter = require('./route.comment')
const reportTotalAnswersRouter = require('./route.reportTotalAnswers')
const express = require('express')
const { routeMiddleware } = require('../middleware/middleware.authorization')
const router = express.Router()

router.use('/login', loginRouter)
router.use('/user', userRouter)
router.use(routeMiddleware)

router.use('/survey', surveyRouter)
router.use('/count', reportTotalAnswersRouter)
router.use('/company', companyRouter)
router.use('/building', buildingRouter)
router.use('/comment', commentRouter)

module.exports = router
