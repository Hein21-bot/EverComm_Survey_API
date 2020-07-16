const { surveydb } = require('../db')
const response = require('../model/response')
var groupArray = require("group-array");


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
    return surveydb.typeAndArea()
        .then(data => {
            if (data.length > 0) {
                const result = data.reduce((r, c) => {
                    const R = [...r]
                    const index = R.findIndex(v => v.id == c.option_choice_id)
                    if (index === -1) {
                        R.push({ id: c.option_choice_id, name: c.option_choice_name, categories: [{ [c.building_type]: c.optionCount }] })
                    }
                    else {
                        R[index].categories.push({ [c.building_type]: c.optionCount })
                    }
                    return R
                }, [])
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

// const graphReportApi = () => {
//     return surveydb.graphReportApi()
// }

const graphReportUserLevel = (userId, startDate, endDate, viewType) => {
    return surveydb.userLevelAnswer(userId, viewType).then(res => {
        if (res[0][0].user_level_id == 1 || res[0][0].user_level_id == 3) {
            if (viewType == "all") {
                const graphReportApi = (userId, startDate, endDate) => {
                    return surveydb.graphReportApi(userId, startDate, endDate)
                }
                return graphReportApi
            } else {
                const graphReportApiRole = (userId, startDate, endDate) => {
                    return surveydb.graphReportApiRole(userId, startDate, endDate)
                }
                return graphReportApiRole
            }
        } else {
            const graphReportApiRole = (userId, startDate, endDate) => {
                return surveydb.graphReportApiRole(userId, startDate, endDate)
            }
            return graphReportApiRole
        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}


const chiller = () => {
    return surveydb.chiller()
        .then(data => {
            if (data.length > 0) {
                let surveySections3 = Object.keys(groupArray(data, "building_type")).map((v, k) => {
                    return groupArray(data, "building_type")[v];
                  }).map((v1, k1) => {
                    return {
                      building_type: v1[0].building_type,
                      categories: Object.keys(groupArray(v1, "option_choice_name")).map((v2, k2) => {
                        return groupArray(v1, "option_choice_name")[v2]
                      }).map((v3, k3) => {
                        return {
                          option_choice_name: v3[0].option_choice_name,
                          buildingCount: v3[0].buildingCount
                        }
                      }).map((categories => {
                          let rObj = {}
                          rObj[categories.option_choice_name.trim()] = categories.buildingCount
                          return rObj
                        })).reduce(((r, c) => Object.assign(r, c)), {})
                    }
                  })
                  const reultedData = surveySections3.reduce((r, c) => {
                    const R = { ...r }
                    R[c.building_type] = c.categories
                    
                    return R
                  }, {})
                return reultedData
            } else return []
        })
        .catch(error => {
            throw error
        })

}



module.exports = { userLevelAnswer, userLevelMenuAnswer, graphReportUserLevel, chiller }