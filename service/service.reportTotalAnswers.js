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

const typeAndArea = () => {
    return surveydb.typeAndArea().then(data => {
        if (data.length > 0) {
           const result= data.reduce((r,c)=>{
              const R =[...r]
              const index = R.findIndex(v=>v.id==c.option_choice_id)
              if(index===-1){
                  R.push({id:c.option_choice_id,name:c.option_choice_name,categories:[{[c.building_type]: c.optionCount}] })
              }
              else{
                R[index].categories.push({[c.building_type]: c.optionCount})
              }
              return R
            },[])
            return result
        } else return []
    })
    .catch(error => {
        throw error
    })

}

// const typeAndBMS = () => {
//     return surveydb.typeAndBMS()
// }

// const age = () => {
//     return surveydb.age()
// }

const graphReportApi = () => {
    return surveydb.graphReportApi()
}



module.exports = { userLevelAnswer, userLevelMenuAnswer, typeAndArea, graphReportApi }