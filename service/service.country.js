const { surveydb } = require('../db')


const addCountry = (country, organization, surveyHeaderId, userId) => {

    return surveydb.checkDuplicateCountry(country, organization).then(data => {
        if (data.length > 0) {
            return []
        }
        else {
            return surveydb.addCountry(country, organization, surveyHeaderId, userId)
        }

    }).catch(error => {
        throw error.toString()

    })
}

const getCountry = (surveyHeaderId) => {
    return surveydb.getCountry(surveyHeaderId)
}

const getCountrySurvey = (surveyHeaderId) => {
    return surveydb.getCountrySurvey(surveyHeaderId)
}

module.exports = { addCountry, getCountry, getCountrySurvey }