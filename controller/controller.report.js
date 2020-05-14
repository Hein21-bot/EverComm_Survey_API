const { reportService } = require('../service')
const response = require('../model/response')
const { surveydb } = require('../db')

const getOpening = (req, res) => {
    const startDate = req.body.startDate;
    const accountLedgerId = req.body.accountLedgerId;
    reportService.getOpening(startDate, accountLedgerId).then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

const getGeneralLedger = (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const accountLedgerId = req.body.accountLedgerId;
    reportService.getGeneralLedger(startDate, endDate, accountLedgerId).then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

const getDashboardData = (req, res) => {
    reportService.getDashboardData().then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

module.exports = { getOpening, getGeneralLedger, getDashboardData };