const { companyService } = require('../service')
const response = require('../model/response')
const { surveydb } = require('../db')

const addCompany = (req, res) => {
    companyService.addCompany().then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

const getCompany = (req, res) => {
    companyService.getCompany().then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

module.exports = { addCompany, getCompany }