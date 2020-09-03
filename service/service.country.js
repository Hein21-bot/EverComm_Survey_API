const { surveydb } = require('../db')


const addCountry = (country, organization, surveyHeaderId) => {
    return surveydb.addCountry(country, organization, surveyHeaderId)
}

const getCountry = (surveyHeaderId) => {
    return surveydb.getCountry(surveyHeaderId)
}

const getCountrySurvey = (surveyHeaderId) => {
    return surveydb.getCountrySurvey(surveyHeaderId)
}

module.exports = { addCountry, getCountry, getCountrySurvey }