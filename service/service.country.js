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

const getCountry = (surveyHeaderId, countryId) => {
    return surveydb.getCountry(surveyHeaderId, countryId)
}

const getCountrySurvey = (surveyHeaderId) => {
    return surveydb.getCountrySurvey(surveyHeaderId)
}

module.exports = { addCountry, getCountry, getCountrySurvey }