const { surveydb } = require('../db')

const getCompany = () => {
    return surveydb.getFormInfo();
}

const addCompany = () => {
    return surveydb.getFormInfo();
}

module.exports = { getCompany, addCompany }