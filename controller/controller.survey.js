const { surveyService } = require("../service");
const response = require("../model/response");
const { surveydb } = require("../db");
var groupArray = require("group-array");

const getQuestion = (req, res) => {
  const admin_id = req.params.admin_id;
  const survey_header_id = req.params.survey_header_id;
  const buildingId = req.params.buildingId;
  let count = 0;
  let zz = 0;

  surveyService
    .getQuestion(admin_id, survey_header_id, buildingId)
    .then((data) => {
      
      let surveySections = Object.keys(
        groupArray(data[0], "survey_section_id")
      ).map((v, k) => {
        return groupArray(data[0], "survey_section_id")[v];
      });

      // let dd= surveySections[0].filter(d=> {
      //     return  d.device_type=='chiller 1' || d.device_type=='condenser 1' || d.device_type == 'evaporator 1' ||
      //     d.device_type == "cooling tower 1" || d.device_type == '1' || d.device_type == '7'})
      //    const rr=dd.map(c=>console.log((c.question_id)))
      // console.log(surveySections[0][0].device_type)

      let ans = [
        {
          survey_header_id: surveySections[0][0].survey_header_id,
          survey_name: surveySections[0][0].survey_name,
          survey_sections: surveySections.map((section) => {
            count += Object.keys(
              groupArray(
                // section.filter((d) => d.input_types_id !== 8),
                section,
                "question_id"
              )
            ).length;
            return {
              survey_section_id: section[0].survey_section_id,
              section_name: section[0].section_name,
              questions: Object.keys(groupArray(section, "question_id"))
                .map((v, k) => {
                  return groupArray(section, "question_id")[v];
                })
                .map((v1, k1) => {
                  return {
                    question_id: v1[0].question_id,
                    question_name: v1[0].question_name,
                    input_type_id: v1[0].input_types_id,
                    option_choices: v1.map((c) => {
                      return {
                        option_choice_id: c.option_choice_id,
                        option_choice_name: c.option_choice_name,
                      };
                    }),
                  };
                }),
              section_question_count: Object.keys(
                groupArray(section, "question_id")
              ).map((v, k) => {
              
                  return groupArray(section, "question_id")[v];
              }).length,
            };
          }),
          question_count: count,
          answers: data[1],
          amountOfDevice: data[2],
        },
      ];

      // let tmparr = ans[0];
      // let test = 0;
      // tmparr.survey_sections.map((v, k) => {
      //     test += v.devicesQuestions[0].questions.length;
      // });

      // ans[0].question_count = test;

      res.json(response({ success: true, payload: ans }));
    })
    .catch((err) => res.json(response({ success: false, message: err })));
};

// return {
//     "survey_section_id": section[0].survey_section_id, "section_name": section[0].section_name, "devicesQuestions":
//         Object.keys(groupArray(section, 'device_type')).map((v, k) => {
//             return groupArray(section, 'device_type')[v]
//         }).map((v1, k1) => {
//             count += Object.keys(groupArray(v1.filter(d => d.input_types_id !== 8), 'question_id')).length

//             return {
//                 "deviceName": v1[0].device_type, "questions":
//                     Object.keys(groupArray(v1, 'question_id')).map((v2, k2) => {
//                         return groupArray(v1, 'question_id')[v2]
//                     }).map((v3, k3) => {
//                         return {
//                             "question_id": v3[0].question_id, "question_name": v3[0].question_name,
//                             "input_type_id": v3[0].input_types_id, "option_choices": v3.map(c => {
//                                 return {
//                                     "option_choice_id": c.option_choice_id, "option_choice_name": c.option_choice_name
//                                 }

//                             })
//                         }
//                     })

//             }
//         })
// }

const surveyList = (req, res) => {
  let userId = req.params.user_id;
  let survey_header_id = req.params.survey_header_id;
  surveyService
    .surveyList(userId, survey_header_id)
    .then((data) => {
      let surveyList = {
        survey_list: data[0], //pending and completed for questions
        new_survey_list: data[1], //for building
      };
      res.json(response({ success: true, payload: surveyList }));
    })
    .catch((err) => res.json(response({ success: false, message: err })));
};

const surveyMenuApi = (req, res) => {
  let userId = req.params.user_id;
  surveyService
    .surveyMenuApi(userId)
    .then((data) => {
      data(userId).then((data) => {
        let surveySections = Object.keys(groupArray(data, "survey_header_id"))
          .map((v, k) => {
            return groupArray(data, "survey_header_id")[v];
          })
          .map((v1, k1) => {
            return {
              survey_header_id: v1[0].survey_header_id,
              survey_name: v1[0].survey_name,
              amount_of_survey: v1[0].amount_of_survey,
              created_date: v1[0].created_date.toString(),
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

  let count = 0;
  let queryLoop = new Promise((resolve, reject) => {
    surveyService.deleteAnswer(
      req.body.data[0].userId,
      req.body.data[0].survey_headers_id,
      req.body.data[0].building_id
    );
    req.body.data.map((data) => {
      let other = data.other;
      let optionChoiceId = data.optionChoiceId;
      let userId = data.userId;
      let questionId = data.questionId;
      let survey_headers_id = data.survey_headers_id;
      let building_id = data.building_id;
      // let device_type = data.device_type;
      surveyService
        .addAnswer(
          other,
          optionChoiceId,
          userId,
          questionId,
          survey_headers_id,
          building_id
          // device_type
        )
        .then((data) => {
          count++;
          if (count == targetCount) resolve({ answeredCount: count });
        })
        .catch((err) => reject(err));
    });
  });

  queryLoop
    .then((data) => {
      res.json(response({ success: true, payload: data }));
    })
    .catch((err) => res.json(response({ success: false, message: err })));
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
  let userId = req.params.user_id;
  surveyService
    .getMenu(userId)
    .then((data) => {
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
};
