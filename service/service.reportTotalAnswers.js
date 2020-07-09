const { surveydb } = require('../db')
const response = require('../model/response')


const userLevelAnswer = (userId, surveyHeaderId, startDate, endDate, viewType) => {
    return surveydb.userLevelAnswer(userId, surveyHeaderId).then(res => {
        if (res[0][0].user_level_id == 1) {

            if (viewType == "all") {
                const reportTotalAnswers = (userId, surveyHeaderId, startDate, endDate) => {
                    return surveydb.reportTotalAnswers(userId, surveyHeaderId, startDate, endDate)
                }

                return reportTotalAnswers
            } else {

                const reportUserAnswer = (userId, surveyHeaderId, startDate, endDate) => {
                    return surveydb.reportUserAnswer(userId, surveyHeaderId, startDate, endDate);
                }
                return reportUserAnswer
            }


        } else if (res[0][0].user_level_id == 2) {

            const reportUserAnswer = (userId, surveyHeaderId, startDate, endDate) => {
                return surveydb.reportUserAnswer(userId, surveyHeaderId, startDate, endDate);
            }
            return reportUserAnswer

        } else {
            if (viewType == "all") {

                const reportDistributorAnswers = (userId, surveyHeaderId, startDate, endDate) => {
                    return surveydb.reportDistributorAnswers(userId, surveyHeaderId, startDate, endDate);
                }
                return reportDistributorAnswers
            } else {

                const reportUserAnswer = (userId, surveyHeaderId, startDate, endDate) => {
                    return surveydb.reportUserAnswer(userId, surveyHeaderId, startDate, endDate);
                }
                return reportUserAnswer
            }

        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}

const userLevelMenuAnswer = (userId, surveyHeaderId, startDate, endDate, viewType) => {
    return surveydb.userLevelAnswer(userId, surveyHeaderId, viewType).then(res => {
        if (res[0][0].user_level_id == 1) {

            if (viewType == "all") {

                const dateTimeMenuAdminApi = (userId, startDate, endDate) => {
                    return surveydb.dateTimeMenuAdminApi(userId, startDate, endDate);
                }

                return dateTimeMenuAdminApi
            } else {

                const dateTimeMenuApi = (userId, startDate, endDate) => {
                    return surveydb.dateTimeMenuApi(userId, startDate, endDate);
                }
                return dateTimeMenuApi

            }

        } else if (res[0][0].user_level_id == 2) {

            const dateTimeMenuApi = (userId, startDate, endDate) => {
                return surveydb.dateTimeMenuApi(userId, startDate, endDate);
            }
            return dateTimeMenuApi

        } else {
            if (viewType == "all") {

                const dateTimeMenuDistributorApi = (userId, startDate, endDate) => {
                    return surveydb.dateTimeMenuDistributorApi(userId, startDate, endDate);
                }

                return dateTimeMenuDistributorApi
            } else {

                const dateTimeMenuApi = (userId, startDate, endDate) => {
                    return surveydb.dateTimeMenuApi(userId, startDate, endDate)

                }
                return dateTimeMenuApi
            }
        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}

// const typeAndArea = () => {
//     return surveydb.typeAndArea().then(data=> {
//         if (data.length > 0){
//             return data.map( v => ({
//                 ...v,
//                 option_choice_name:v.option_choice_name
//             }))
//             .map( v=> ({
//                 ...v,
//                 categories: [v.building_type,v.optionCount]
//             }))
//         }
//     })
// }

// const typeAndBMS = () => {
//     return surveydb.typeAndBMS()
// }

// const age = () => {
//     return surveydb.age()
// }

const graphReportApi = () => {
    return surveydb.graphReportApi()
}



module.exports = { userLevelAnswer, userLevelMenuAnswer, graphReportApi }