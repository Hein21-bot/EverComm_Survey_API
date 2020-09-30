const { surveydb } = require('../db')
const response = require('../model/response')
var groupArray = require("group-array");


const userLevelAnswer = (userId, surveyHeaderId, viewType, countryId) => {
    return surveydb.userLevelAnswer(userId, surveyHeaderId, viewType, countryId).then(res => {
        if (res[0][0].user_level_id == 1) {
            if (viewType == "all") {
                const reportTotalAnswers = (userId, surveyHeaderId, countryId) => {
                    return surveydb.reportTotalAnswers(userId, surveyHeaderId, countryId)
                }
                return reportTotalAnswers
            } else {
                const reportUserAnswer = (userId, surveyHeaderId, countryId) => {
                    return surveydb.reportUserAnswer(userId, surveyHeaderId, countryId);
                }
                return reportUserAnswer
            }
        } else if (res[0][0].user_level_id == 2) {
            const reportUserAnswer = (userId, surveyHeaderId, countryId) => {
                return surveydb.reportUserAnswer(userId, surveyHeaderId, countryId);
            }
            return reportUserAnswer
        } else {
            if (viewType == "all") {
                const reportDistributorAnswers = (userId, surveyHeaderId, countryId) => {
                    return surveydb.reportDistributorAnswers(userId, surveyHeaderId, countryId);
                }
                return reportDistributorAnswers
            } else {
                const reportUserAnswer = (userId, surveyHeaderId, countryId) => {
                    return surveydb.reportUserAnswer(userId, surveyHeaderId, countryId);
                }
                return reportUserAnswer
            }
        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}

const userLevelMenuAnswer = (userId, surveyHeaderId, viewType) => {
    return surveydb.userLevelAnswer(userId, surveyHeaderId, viewType).then(res => {
        if (res[0][0].user_level_id == 1) {
            if (viewType == "all") {
                const dateTimeMenuAdminApi = (userId) => {
                    return surveydb.dateTimeMenuAdminApi(userId);
                }
                return dateTimeMenuAdminApi
            } else {
                const dateTimeMenuApi = (userId) => {
                    return surveydb.dateTimeMenuApi(userId);
                }
                return dateTimeMenuApi
            }
        } else if (res[0][0].user_level_id == 2) {
            const dateTimeMenuApi = (userId) => {
                return surveydb.dateTimeMenuApi(userId);
            }
            return dateTimeMenuApi
        } else {
            if (viewType == "all") {
                const dateTimeMenuDistributorApi = (userId) => {
                    return surveydb.dateTimeMenuDistributorApi(userId);
                }
                return dateTimeMenuDistributorApi
            } else {
                const dateTimeMenuApi = (userId) => {
                    return surveydb.dateTimeMenuApi(userId)
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

const graphReportUserLevel = (userId, viewType) => {
    return surveydb.userLevelAnswer(userId, viewType).then(res => {
        if (res[0][0].user_level_id == 1 || res[0][0].user_level_id == 3) {
            if (viewType == "all") {
                const graphReportApi = (userId) => {
                    return surveydb.graphReportApi(userId)
                }
                return graphReportApi
            } else {
                const graphReportApiRole = (userId) => {
                    return surveydb.graphReportApiRole(userId)
                }
                return graphReportApiRole
            }
        } else {
            const graphReportApiRole = (userId) => {
                return surveydb.graphReportApiRole(userId)
            }
            return graphReportApiRole
        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}


const chiller = () => {
    return surveydb.chiller()
        .then(data => {
            if (data.length > 0) {
                let surveySections2 = Object.keys(groupArray(data, "option_choice_name")).map((v, k) => {
                    return groupArray(data, "option_choice_name")[v];
                })
                    .map((v1, k1) => {
                        return {
                            name: v1[0].option_choice_name, categories: Object.keys(groupArray(v1, v1[0].Siemens)).map((v2, k2) => {
                                return groupArray(v1, v1[0].Siemens)[v2]
                            })
                                .map((v3, k3) => {
                                    return {
                                        building_type: v3[0].building_type
                                    }
                                })
                                .map((categories => {
                                    return categories.building_type
                                })),
                            //   data: Object.keys(groupArray(v1, "building_type")).map((v4, k4) => {
                            //     return groupArray(v1, "building_type")[v4];
                            //   })
                            // .map((v5, k5) => {
                            //         return {
                            //           option_count: v5[0].option_count,
                            //         };
                            //       })
                            // .map((categories => {
                            //         return categories.option_count
                            //       })),
                            //       y: Object.keys(groupArray(v1, "building_type")).map((v4, k4) => {
                            //         return groupArray(v1, "building_type")[v4];
                            //       })
                            // .map((v5, k5) => {
                            //         return {
                            //           option_count: v5[0].option_count,
                            //         };
                            //       })
                            //   .map((categories => {
                            //     return categories.option_count
                            //   })).reduce(function (accumulator, currentValue, currentIndex, array) {
                            //     return accumulator + currentValue
                            //   })
                        }
                    })
                return surveySections2
            } else return []
        })
        .catch(error => {
            throw error
        })

}

const report = () => {
    return surveydb.report()
}


module.exports = { userLevelAnswer, userLevelMenuAnswer, graphReportUserLevel, chiller, report }