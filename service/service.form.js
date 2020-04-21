const { surveydb } = require('../db')

const getFormInfo = (companyId) => {
    return surveydb.getFormInfo(companyId);
}


module.exports = { getFormInfo }