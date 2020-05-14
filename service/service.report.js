const { surveydb } = require('../db')

const getOpening = (startDate, accountLedgerId) => {
    return surveydb.getOpening(startDate, accountLedgerId);
}

const getGeneralLedger = (startDate, endDate, accountLedgerId) => {
    return surveydb.getGeneralLedger(startDate, endDate, accountLedgerId);
}

const getDashboardData = () => {
    return surveydb.getDashoboardData()
}

module.exports = { getOpening, getGeneralLedger, getDashboardData };