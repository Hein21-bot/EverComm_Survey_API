const {surveydb} = require('../db')

const getQuestion = (admin_id,surey_header_id) => {
    return surveydb.getQuestion(admin_id,surey_header_id);
}

module.exports = {getQuestion};