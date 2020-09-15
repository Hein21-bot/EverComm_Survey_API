const { surveyService } = require("../service");
const response = require("../model/response");
const { surveydb } = require("../db");
var groupArray = require("group-array");
const moment = require("moment");

const getQuestion = (req, res) => {
  const admin_id = req.params.admin_id;
  const survey_header_id = req.params.survey_header_id;
  const buildingId = req.params.buildingId;
  const buildingTypeId = req.params.buildingTypeId;
  const surveySectionId = req.params.surveySectionId
  const countryId = req.params.countryId
  let count = 0;


  surveyService.getQuestion(admin_id, survey_header_id, buildingId, buildingTypeId, surveySectionId, countryId).then((data) => {
    if (survey_header_id == 1) {

      if (data[3][0].BMSInstalled == 1) {
        const surveySections = Object.keys(groupArray(data[0], "survey_section_id")).map((v, k) => {
          return groupArray(data[0], "survey_section_id")[v];
        })
        let ans = [
          {
            survey_header_id: surveySections[0][0].survey_header_id, survey_name: surveySections[0][0].survey_name, survey_sections: surveySections.map((section) => {
              count += Object.keys(groupArray(section, "question_id")).length;
              return {
                survey_section_id: section[0].survey_section_id, section_name: section[0].section_name, questions: Object.keys(groupArray(section, "question_id")).map((v, k) => {
                  return groupArray(section, "question_id")[v];
                }).map((v1, k1) => {
                  return {
                    question_id: v1[0].question_id, question_name: v1[0].question_name, input_type_id: v1[0].input_types_id, option_group_id: v1[0].option_groups_id, key: v1[0].question_key,
                    option_choices: v1.map((c) => {
                      return {
                        option_choice_id: c.option_choice_id != null ? c.option_choice_id : null, option_choice_name: c.option_choice_name,
                      };
                    }),
                  };
                }),
                section_question_count: Object.keys(groupArray(section, "question_id")).map((v, k) => {
                  return groupArray(section, "question_id")[v];
                }).length,
              };
            }),
            question_count: count,
            answers: data[1],
            amountOfDevice: data[2],

          },
        ];
        res.json(response({ success: true, payload: ans }));

      } else {
        const surveySections = Object.keys(groupArray(data[0].filter(v => v.survey_section_id != 6), "survey_section_id")).map((v, k) => {
          return groupArray(data[0], "survey_section_id")[v];
        })
        let ans = [
          {
            survey_header_id: surveySections[0][0].survey_header_id, survey_name: surveySections[0][0].survey_name, survey_sections: surveySections.map((section) => {
              count += Object.keys(groupArray(section, "question_id")).length;
              return {
                survey_section_id: section[0].survey_section_id, section_name: section[0].section_name, questions: Object.keys(groupArray(section, "question_id")).map((v, k) => {
                  return groupArray(section, "question_id")[v];
                }).map((v1, k1) => {
                  return {
                    question_id: v1[0].question_id, question_name: v1[0].question_name, input_type_id: v1[0].input_types_id, option_group_id: v1[0].option_groups_id, key: v1[0].question_key,
                    option_choices: v1.map((c) => {
                      return {
                        option_choice_id: c.option_choice_id, option_choice_name: c.option_choice_name,
                      };
                    }),
                  };
                }),
                section_question_count: Object.keys(groupArray(section, "question_id")).map((v, k) => {
                  return groupArray(section, "question_id")[v];
                }).length,
              };
            }),
            question_count: count,
            answers: data[1],
            amountOfDevice: data[2],
          },
        ];
        res.json(response({ success: true, payload: ans }));

      }
    } else {
      const surveySections = Object.keys(groupArray(data[0], "survey_section_id")).map((v, k) => {
        return groupArray(data[0], "survey_section_id")[v];
      })
      let ans = [
        {
          survey_header_id: surveySections[0][0].survey_header_id, survey_name: surveySections[0][0].survey_name, survey_sections: surveySections.map((section) => {
            count += Object.keys(groupArray(section, "primary_question")).length;
            return {
              survey_section_id: section[0].survey_section_id, section_name: section[0].section_name, questions: Object.keys(groupArray(section, "primary_question")).map((v, k) => {
                return groupArray(section, "primary_question")[v];
              }).map((v1, k1) => {

                if (v1[0].sub_question_id == null) {

                  return {
                    question_id: v1[0].primary_question, question_name: v1[0].question_name, input_type_id: v1[0].input_types_id, option_group_id: v1[0].option_groups_id, key: v1[0].question_key,
                    option_choices: v1.map((c) => {
                      //console.log(c ,"c is ")
                      // const data = v1.filter(v => v.choices_id === 387)
                      // console.log(c)
                      return {
                        option_choice_id: c.choices_id, option_choice_name: c.choices,
                      }
                    })
                  }
                }
                else if (v1[0].choices_id == null) {
                  const dataResult1 = []

                  v1.map((c) => {
                    const index = dataResult1.find(v => v.option_choice_id == c.oc)
                    if (index == null || index == undefined) {
                      // console.log(c.categories)
                      dataResult1.push({ option_choice_id: c.oc, categories: c.cat })
                    }
                  })
                  return {

                    question_id: v1[0].primary_question, question_name: v1[0].question_name, input_type_id: v1[0].input_types_id, option_group_id: v1[0].option_groups_id, key: v1[0].question_key,
                    categories: dataResult1.filter(c => c.categories != null),
                    sub_questions: Object.keys(groupArray(v1, "sub_question_id")).map((v2, k2) => {
                      return groupArray(v1, "sub_question_id")[v2]
                    }).map((v3, k3) => {
                      const dataResult = []
                      v3.map((c) => {
                        const index = dataResult.find(v => v.option_choice_id == c.oc)
                        if (index == null || index == undefined) {
                          dataResult.push({ option_choice_id: c.oc, option_choice_name: c.option_choice_name })
                        }
                      })
                      return {
                        sub_question_id: v3[0].sub_question_id, sub_question_name: v3[0].sub_question_name, input_type_id: v3[0].input_type_id, option_group_id: v3[0].option_group_id,
                        option_choices: dataResult.filter(v => v.option_choice_name != null),
                      }
                    })
                  }
                }
                else {
                  const dataResult = []
                  const dataResult1 = []

                  v1.map((c) => {
                    const index = dataResult.find(v => v.option_choice_id == c.choices_id)
                    if (index == null || index == undefined) {
                      dataResult.push({ option_choice_id: c.choices_id, option_choice_name: c.choices })
                    }
                  }),
                    v1.map((c) => {
                      const index = dataResult1.find(v => v.option_choice_id == c.choices_id)
                      if (index == null || index == undefined) {
                        dataResult1.push({ option_choice_id: c.choices_id, categories: c.categories, })
                      }
                    })
                  return {
                    question_id: v1[0].primary_question, question_name: v1[0].question_name, input_type_id: v1[0].input_types_id, option_group_id: v1[0].option_groups_id, key: v1[0].question_key,
                    categories: dataResult1.filter(c => c.categories != null),
                    option_choices: dataResult.filter(c => c.option_choice_name != null),
                    sub_questions: Object.keys(groupArray(v1, "sub_question_id")).map((v2, k2) => {
                      return groupArray(v1, "sub_question_id")[v2]
                    }).map((v3, k3) => {
                      const dataResult = []
                      v1.map((c) => {
                        const index = dataResult.find(v => v.option_choice_id == c.oc)
                        if (index == null || index == undefined) {
                          dataResult.push({ option_choice_id: c.oc, option_choice_name: c.option_choice_name })
                        }
                      })
                      return {
                        sub_question_id: v3[0].sub_question_id, sub_question_name: v3[0].sub_question_name, input_type_id: v3[0].input_type_id, option_group_id: v3[0].option_group_id,
                        option_choices: dataResult.filter(c => c.option_choice_name != null)
                      }
                    })
                  }


                }


              }),

            };
          }),
          question_count: count,
          answers: data[1],
          amountOfDevice: data[2],

        },
      ];

      res.json(response({ success: true, payload: ans }));
    }
  })
    .catch((err) => res.json(response({ success: false, message: err.toString() })));
};

// let surveySections = Object.keys(groupArray(data[0], "survey_section_id")).map((v, k) => {
//   return groupArray(data[0], "survey_section_id")[v];
// })



// let dd= surveySections[0].filter(d=> {
//     return  d.device_type=='chiller 1' || d.device_type=='condenser 1' || d.device_type == 'evaporator 1' ||
//     d.device_type == "cooling tower 1" || d.device_type == '1' || d.device_type == '7'})
//    const rr=dd.map(c=>console.log((c.question_id)))
// console.log(surveySections[0][0].device_type)

// let ans = [
//   {
//     survey_header_id: surveySections[0][0].survey_header_id, survey_name: surveySections[0][0].survey_name, survey_sections: surveySections.map((section) => {
//       count += Object.keys(groupArray(section, "question_id")).length;
//       return {
//         survey_section_id: section[0].survey_section_id, section_name: section[0].section_name, questions: Object.keys(groupArray(section, "question_id")).map((v, k) => {
//           return groupArray(section, "question_id")[v];
//         }).map((v1, k1) => {
//           return {
//             question_id: v1[0].question_id, question_name: v1[0].question_name, input_type_id: v1[0].input_types_id, option_group_id: v1[0].option_groups_id,
//             option_choices: v1.map((c) => {
//               return {
//                 option_choice_id: c.option_choice_id, option_choice_name: c.option_choice_name,
//               };
//             }),
//           };
//         }),
//         section_question_count: Object.keys(groupArray(section, "question_id")).map((v, k) => {
//           return groupArray(section, "question_id")[v];
//         }).length,
//       };
//     }),
//     question_count: count,
//     answers: data[1],
//     amountOfDevice: data[2],
//     BMSInstalled: data[3][0].BMSInstalled
//   },
// ];

const surveyList = (req, res) => {
  let userId = req.params.user_id;
  let survey_header_id = req.params.survey_header_id;
  surveyService.surveyList(userId, survey_header_id).then((data) => {
    let surveyList = {
      survey_list: data[0], //pending and completed for questions
      new_survey_list: data[1], //for building
    };
    res.json(response({ success: true, payload: surveyList }));
  })
    .catch((err) => res.json(response({ success: false, message: err })));
};

const sectionList = (req, res) => {
  let surveyHeaderId = req.params.surveyHeaderId
  let countryId = req.params.countryId
  surveyService.sectionList(surveyHeaderId, countryId).then(data => {
    return res.json(
      response({
        success: true,
        message: "Success!",
        payload: data
      })
    )
  }).catch(err => {
    res.json(response({ success: false, message: err }));
  });
}

const surveyMenuApi = (req, res) => {
  let userId = req.params.userId;
  surveyService.surveyMenuApi(userId).then((data) => {
    data(userId).then((data) => {
      let surveySections = Object.keys(groupArray(data[0], "survey_header_id"))
        .map((v, k) => {
          return groupArray(data[0], "survey_header_id")[v];
        })
        .map((v1, k1) => {
          return {
            survey_header_id: v1[0].survey_header_id,
            survey_name: v1[0].survey_name,
            amount_of_survey: v1[0].amount_of_survey,
            created_date: moment(v1[0].created_date).format('YYYY/MM/DD'),
            modified_date: moment(v1[0].modified_date).format('YYYY/MM/DD'),
            count: v1[0].survey_header_id == 1 ? v1[0].buildingCount : v1[0].organizationCount,
            active: v1[0].active,
            survey_section: Object.keys(groupArray(v1, "survey_section_id"))
              .map((v2, k2) => {
                return groupArray(v1, "survey_section_id")[v2];
              })
              .map((v3, k3) => {
                return {
                  survey_section_id: v3[0].survey_section_id,
                  survey_section_name: v3[0].section_name,
                };
              }),
          };
        });

      res.json(response({ success: true, payload: surveySections }));
    });
  })
    .catch((err) =>
      res.json(response({ success: false, message: err.toString() }))
    );
};

const addAnswer = (req, res) => {
  let targetCount = req.body.data.length;
  // console.log("data is", req.body)
  let count = 0;
  let queryLoop = new Promise((resolve, reject) => {
    surveyService.deleteAnswer(req.body.data[0].userId, req.body.data[0].survey_headers_id, req.body.data[0].building_id, req.body.data[0].countryId, req.body.data[0].surveySectionId)
    req.body.data.map(async data => {
      let optionChoiceId = data.optionChoiceId;
      let other = data.other;
      let userId = data.userId;
      let questionId = data.questionId;
      let survey_headers_id = data.survey_headers_id;
      let building_id = data.building_id;
      let keyValue = data.keyValue
      let answeredDate = moment.utc(new Date()).local().format('YYYY-MM-DD HH:mm:ss');
      let totalQuestionCount = req.body.total
      let buildingType = req.body.buildingType
      let countryId = data.countryId
      let subQuestionId = data.subQuestionId
      let surveySectionId = data.surveySectionId
      try {
        let addData = await surveyService.addAnswer(other, optionChoiceId, userId, questionId, survey_headers_id, building_id, keyValue, totalQuestionCount, answeredDate, buildingType, countryId, subQuestionId, surveySectionId)
        count++;
        if (count == targetCount) resolve({ answeredCount: count });
      }
      catch (error) {
        console.log("error add Answer ", error.toString())
      }
    });
  });

  queryLoop.then((data) => {
    res.json(response({ success: true, payload: data }));
  })
    .catch((err) => res.json(response({ success: false, message: err.toString() })));
};

const deleteAnswer = (req, res) => {
  const userId = req.params.user_id;
  const survey_header_id = req.params.survey_header_id;
  const building_id = req.params.building_id;
  surveyService
    .deleteAnswer(userId, survey_header_id, building_id)
    .then((data) => {
      if (data.length === 0) {
        res.json(
          response({
            success: false,
            payload: null,
            message: "Database Connection Fail!",
          })
        );
      } else {
        res.json(response({ success: true, payload: data }));
      }
    })
    .catch((err) => {
      res.json(response({ success: false, message: err }));
    });
};

const dateTimeMenuApi = (req, res) => {
  const userId = req.params.user_id;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  surveyService
    .dateTimeMenuApi(userId, startDate, endDate)
    .then((data) => {
      let surveySections = Object.keys(groupArray(data, "survey_header_id"))
        .map((v, k) => {
          return groupArray(data, "survey_header_id")[v];
        })
        .map((v1, k1) => {
          return {
            survey_header_id: v1[0].survey_header_id,
            survey_name: v1[0].survey_name,
            survey_created_date: v1[0].created_date.toString(),
            amount_of_survey: Object.keys(groupArray(v1, "buildings_id"))
              .map((v2, k2) => {
                return groupArray(v1, "buildings_id")[v2];
              })
              .map((v3, k3) => {
                return {
                  building_id: v3[0].buildings_id,
                  building_name: v3[0].building_name,
                };
              }),
            survey_section: Object.keys(groupArray(v1, "survey_section_id"))
              .map((v4, k4) => {
                return groupArray(v1, "survey_section_id")[v4];
              })
              .map((v5, k5) => {
                return {
                  survey_section_id: v5[0].survey_section_id,
                  survey_section_name: v5[0].section_name,
                };
              }),
          };
        });
      res.json(response({ success: true, payload: surveySections }));
    })
    .catch((err) =>
      res.json(response({ success: false, message: err.toString() }))
    );
};

const getMenu = (req, res) => {
  let userId = req.params.userId;
  surveyService.getMenu(userId).then((data) => {
    data(userId).then((data) => {
      res.json(response({ success: true, payload: data }));
    });
  })
    .catch((err) => res.json(response({ success: false, message: err })));
};



module.exports = {
  getQuestion,
  addAnswer,
  getMenu,
  deleteAnswer,
  surveyList,
  surveyMenuApi,
  dateTimeMenuApi,
  sectionList
};
