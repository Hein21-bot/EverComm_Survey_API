const { surveydb } = require('../db')


const addCountry = (country, organization, surveyHeaderId, userId) => {

    return surveydb.checkDuplicateCountry(country, organization).then(data => {
        if (data.length > 0) {
            return null
        }
        else {
            return surveydb.addCountry(country, organization, surveyHeaderId, userId)
        }

    }).catch(error => {
        throw error.toString()

    })
}

const getCountry = (surveyHeaderId, userId) => {
    return surveydb.getCountry(surveyHeaderId, userId)
}

const getCountrySurvey = (surveyHeaderId) => {
    return surveydb.getCountrySurvey(surveyHeaderId)
}

module.exports = { addCountry, getCountry, getCountrySurvey }