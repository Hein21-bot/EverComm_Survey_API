const { reportTotalAnswersService } = require("../service");
const response = require("../model/response");
var groupArray = require("group-array");
const moment = require("moment");
const { xssFilter } = require("helmet");

const userLevelAnswer = (req, res) => {
  const userId = req.body.userId;
  const surveyHeaderId = req.params.surveyHeaderId;
  const viewType = req.body.viewType;
  const countryId = req.body.countryId;
  const buildingId = req.body.buildingId;
  const buildingTypeId = req.body.buildingTypeId

  reportTotalAnswersService.userLevelAnswer(userId, surveyHeaderId, viewType, countryId, buildingId, buildingTypeId).then((data) => {
    data(userId, surveyHeaderId, countryId, buildingId, buildingTypeId)
      .then((data) => {
        if (surveyHeaderId == 1) {
          if (viewType == 'all') {
            let surveySections = Object.keys(groupArray(data[0], "survey_section_id")).map((v, k) => {
              return groupArray(data[0].filter((d) => d.input_type_id !== null), "survey_section_id")[v];
            });

            let ans = [
              {
                survey_header_id: surveySections[0][0].survey_header_id, survey_name: surveySections[0][0].survey_name, survey_sections: surveySections.map((section) => {
                  return {
                    survey_section_id: section[0].survey_section_id, section_name: section[0].section_name, questions: Object.keys(groupArray(section, "question_id")).map((v, k) => {
                      return groupArray(section, "question_id")[v];
                    })
                      .map((v1, k1) => {
                        return {
                          question_id: v1[0].question_id, question_name: v1[0].question_name, input_type_id: v1[0].input_type_id, totalAnsCount:
                            v1[0].atcount != null ? v1[0].atcount : 0, option_choices: v1.map((c) => {
                              return {
                                option_choice_name: c.option_choice_name, totalAns: c.acount != null ? c.acount : 0, other: c.other != null && c.other.includes("{") ? JSON.parse(c.other) : c.other,
                              };
                            }),
                        };
                      }),
                  };
                }),
                building_count: data[1],
              },
            ];
            res.json(response({ success: true, payload: ans }));
          }
          else {
            if (data[3][0].BMSInstalled == 1) {
              const surveySections = Object.keys(groupArray(data[0], "survey_section_id")).map((v, k) => {
                return groupArray(data[0], "survey_section_id")[v];
              })
              let ans = [
                {
                  survey_header_id: surveySections[0][0].survey_header_id, survey_name: surveySections[0][0].survey_name, survey_sections: surveySections.map((section) => {
                    // count += Object.keys(groupArray(section, "question_id")).length;
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
                  // question_count: count,
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
                    // count += Object.keys(groupArray(section, "question_id")).length;
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
                  // question_count: count,
                  answers: data[1],
                  amountOfDevice: data[2],
                },
              ];
              res.json(response({ success: true, payload: ans }));
            }

          }

        } else {
          const surveySections = Object.keys(groupArray(data[0], "survey_section_id")).map((v, k) => {
            return groupArray(data[0], "survey_section_id")[v];
          });
          let ans = [
            {
              survey_header_id: surveySections[0][0].survey_header_id, survey_name: surveySections[0][0].survey_name, survey_sections: surveySections.map((section) => {
                return {
                  survey_section_id: section[0].survey_section_id, section_name: section[0].section_name, questions: Object.keys(groupArray(section, "primary_question")).map((v, k) => {
                    return groupArray(section, "primary_question")[v];
                  })
                    .map((v1, k1) => {
                      if (v1[0].sub_question_id == null) {
                        return {
                          question_id: v1[0].primary_question, question_name: v1[0].question_name, input_type_id: v1[0].input_types_id, option_group_id: v1[0].option_groups_id, key: v1[0].question_key, option_choices: v1.map((c) => {

                            return {
                              option_choice_id: c.choices_id, option_choice_name: c.choices,
                            };
                          }),
                        };
                      } else if (v1[0].choices_id == null) {
                        const dataResult1 = [];

                        v1.map((c) => {
                          const index = dataResult1.find((v) => v.option_choice_id == c.oc);
                          if (index == null || index == undefined) {
                            dataResult1.push({
                              option_choice_id: c.oc, categories: c.cat,
                            });
                          }
                        });
                        return {
                          question_id: v1[0].primary_question, question_name: v1[0].question_name, input_type_id: v1[0].input_types_id, option_group_id: v1[0].option_groups_id, key: v1[0].question_key, categories: dataResult1.filter(
                            (v) => v.option_choice_name != null) == "" ? null : dataResult1.filter((v) => v.option_choice_name != null),
                          sub_questions: Object.keys(groupArray(v1, "sub_question_id")).map((v2, k2) => {
                            return groupArray(v1, "sub_question_id")[v2];
                          }).map((v3, k3) => {
                            const dataResult = [];
                            v3.map((c) => {
                              const index = dataResult.find((v) => v.option_choice_id == c.oc);
                              if (index == null || index == undefined) {
                                dataResult.push({
                                  option_choice_id: c.oc, option_choice_name: c.option_choice_name,
                                });
                              }
                            });
                            return {
                              sub_question_id: v3[0].sub_question_id, sub_question_name: v3[0].sub_question_name, input_type_id: v3[0].input_type_id, option_group_id: v3[0].option_group_id, option_choices: dataResult.filter((v) => v.option_choice_name != null),
                            };
                          }),
                        };
                      } else {
                        const dataResult = [];
                        const dataResult1 = [];

                        v1.map((c) => {
                          const index = dataResult.find((v) => v.option_choice_id == c.choices_id);
                          if (index == null || index == undefined) {
                            dataResult.push({
                              option_choice_id: c.choices_id, option_choice_name: c.choices,
                            });
                          }
                        }),
                          v1.map((c) => {
                            const index = dataResult1.find((v) => v.option_choice_id == c.choices_id);
                            if (index == null || index == undefined) {
                              dataResult1.push({
                                option_choice_id: c.choices_id, categories: c.categories,
                              });
                            }
                          });
                        return {
                          question_id: v1[0].primary_question, question_name: v1[0].question_name, input_type_id: v1[0].input_types_id, option_group_id: v1[0].option_groups_id, key: v1[0].question_key, categories: dataResult1.filter((c) => c.categories != null), option_choices: dataResult.filter((c) => c.option_choice_name != null),
                          sub_questions: Object.keys(groupArray(v1, "sub_question_id"))
                            .map((v2, k2) => {
                              return groupArray(v1, "sub_question_id")[v2];
                            })
                            .map((v3, k3) => {
                              const dataResult = [];
                              v1.map((c) => {
                                const index = dataResult.find((v) => v.option_choice_id == c.oc);
                                if (index == null || index == undefined) {
                                  dataResult.push({
                                    option_choice_id: c.oc, option_choice_name: c.option_choice_name,
                                  });
                                }
                              });
                              return {
                                sub_question_id: v3[0].sub_question_id, sub_question_name: v3[0].sub_question_name, input_type_id: v3[0].input_type_id, option_group_id: v3[0].option_group_id, option_choices: dataResult.filter((c) => c.option_choice_name != null),
                              };
                            }),
                        };
                      }
                    }),
                };
              }),
              // question_count: count,
              answers: data[1],
              surveyTitle: data[2][0].surveyTitle,
            },
          ];

          res.json(response({ success: true, payload: ans }));
        }
      })

      .catch((err) =>
        res.json(response({ success: false, message: err.toString() }))
      );
  });
};

const userLevelMenuAnswer = (req, res) => {
  let surveyHeaderId = req.params.surveyHeaderId;
  const userId = req.params.userId;
  const viewType = req.body.viewType;

  reportTotalAnswersService
    .userLevelMenuAnswer(userId, surveyHeaderId, viewType)
    .then((data) => {
      data(userId,)
        .then((data) => {
          let surveySections = Object.keys(
            groupArray(data[0], "survey_header_id")
          )
            .map((v, k) => {
              return groupArray(data[0], "survey_header_id")[v];
            })
            .map((v1, k1) => {
              return {
                survey_header_id: v1[0].survey_header_id,
                survey_name: v1[0].survey_name,
                survey_created_date: moment(v1[0].created_date).format(
                  "DD/MM/YYYY"
                ),
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
                amount_of_country: Object.keys(groupArray(v1, "country_id"))
                  .map((v2, k2) => {
                    return groupArray(v1, "country_id")[v2];
                  })
                  .map((v3, k3) => {
                    return {
                      country_id: v3[0].country_id,
                      country_name: v3[0].country_name,
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
    });
};


const graphReportApiUserLevel = (req, res) => {
  const userId = req.body.userId;
  const viewType = req.body.viewType;
  reportTotalAnswersService
    .graphReportUserLevel(userId, viewType)
    .then((data) => {
      data(userId, viewType)
        .then((data) => {

          let surveySections = Object.keys(groupArray(data[2], "building_type"))
            .map((v, k) => {
              return groupArray(data[2], "building_type")[v];
            })
            .map((v1, k1) => {
              return {
                building_type: v1[0].building_type,
                categories: Object.keys(groupArray(v1, "option_choice_name"))
                  .map((v2, k2) => {
                    return groupArray(v1, "option_choice_name")[v2];
                  })
                  .map((v3, k3) => {
                    return {
                      option_choice_name: v3[0].option_choice_name,
                      buildingCount: v3[0].buildingCount,
                    };
                  })
                  .map((categories) => {
                    let rObj = {};
                    rObj[categories.option_choice_name.trim()] =
                      categories.buildingCount;
                    return rObj;
                  }, [])
                  .reduce((r, c) => Object.assign(r, c), {}),
              };
            });

          let surveySections1 = Object.keys(
            groupArray(data[0], "option_choice_name")
          )
            .map((v, k) => {
              return groupArray(data[0], "option_choice_name")[v];
            })
            .map((v1, k1) => {
              return {
                option_choice_name: v1[0].option_choice_name,
                categories: Object.keys(groupArray(v1, "building_type"))
                  .map((v2, k2) => {
                    return groupArray(v1, "building_type")[v2];
                  })
                  .map((v3, k3) => {
                    return {
                      building_type: v3[0].building_type.replace(/\s/g, ""),
                      optionCount: v3[0].optionCount,
                    };
                  })
                  .map((categories) => {
                    let rObj = {};
                    rObj[categories.building_type.trim()] =
                      categories.optionCount;
                    return rObj;
                  })
                  .reduce((r, c) => Object.assign(r, c), {}),
              };
            });

          const result1 = surveySections1.map((v) => {
            const values = Object.values(v.categories);
            const sumValue = values.reduce((r, c) => r + c, 0);
            return { ...v, count: sumValue };
          });

          let surveySections2 = Object.keys(
            groupArray(data[1], "option_choice_name")
          )
            .map((v, k) => {
              return groupArray(data[1], "option_choice_name")[v];
            })
            .map((v1, k1) => {
              return {
                name: v1[0].option_choice_name,
                categories: Object.keys(groupArray(v1, "building_type"))
                  .map((v2, k2) => {
                    return groupArray(v1, "building_type")[v2];
                  })
                  .map((v3, k3) => {
                    return {
                      building_type: v3[0].building_type,
                    };
                  })
                  .map((categories) => {
                    return categories.building_type;
                  }),
                data: Object.keys(groupArray(v1, "building_type"))
                  .map((v4, k4) => {
                    return groupArray(v1, "building_type")[v4];
                  })
                  .map((v5, k5) => {
                    return {
                      option_count: v5[0].option_count,
                    };
                  })
                  .map((categories) => {
                    return categories.option_count;
                  }),
                y: Object.keys(groupArray(v1, "building_type"))
                  .map((v4, k4) => {
                    return groupArray(v1, "building_type")[v4];
                  })
                  .map((v5, k5) => {
                    return {
                      option_count: v5[0].option_count,
                    };
                  })
                  .map((categories) => {
                    return categories.option_count;
                  })
                  .reduce(function (
                    accumulator,
                    currentValue,
                    currentIndex,
                    array
                  ) {
                    return accumulator + currentValue;
                  }),
              };
            });

          let surveySections3 = Object.keys(
            groupArray(data[3], "building_type")
          )
            .map((v, k) => {
              return groupArray(data[3], "building_type")[v];
            })
            .map((v1, k1) => {
              return {
                building_type: v1[0].building_type,
                categories: Object.keys(groupArray(v1, "option_choice_name"))
                  .map((v2, k2) => {
                    return groupArray(v1, "option_choice_name")[v2];
                  })
                  .map((v3, k3) => {
                    return {
                      option_choice_name: v3[0].option_choice_name,
                      buildingCount: v3[0].buildingCount,
                    };
                  })
                  .map((categories) => {
                    let rObj = {};
                    rObj[categories.option_choice_name.trim()] =
                      categories.buildingCount;
                    return rObj;
                  })
                  .reduce((r, c) => Object.assign(r, c), {}),
              };
            });
          const reultedData = surveySections3.reduce((r, c) => {
            const R = { ...r };
            R[c.building_type] = c.categories;
            return R;
          }, {});

          let surveySections4 = Object.keys(groupArray(data[4], "other"))
            .map((v, k) => {
              return groupArray(data[4], "other")[v];
            })
            .map((v1, k1) => {
              return {
                years: v1[0].other,
                categories: Object.keys(groupArray(v1, "option_choice_name"))
                  .map((v2, k2) => {
                    return groupArray(v1, "option_choice_name")[v2];
                  })
                  .map((v3, k3) => {
                    return {
                      option_choice_name: v3[0].option_choice_name.replace(
                        /\s/g,
                        ""
                      ),
                      optionCount: v3[0].optionCount,
                    };
                  })
                  .map((categories) => {
                    let rObj = {};
                    rObj[categories.option_choice_name.trim()] =
                      categories.optionCount;
                    return rObj0;
                  })
                  .reduce((r, c) => Object.assign(r, c), {}),
              };
            });

          const result = surveySections4.map((v) => {
            const values = Object.values(v.categories);
            const sumValue = values.reduce((r, c) => r + c, 0);
            return { ...v, count: sumValue };
          });
          let ans = [
            surveySections,
            result1,
            surveySections2,
            reultedData,
            result,
          ];

          res.json(response({ success: true, payload: ans }));
        })
        .catch((err) =>
          res.json(response({ success: false, message: err.toString() }))
        );
    });
};

const chiller = (req, res) => {
  reportTotalAnswersService
    .chiller()
    .then((data) => {
      res.json(response({ success: true, payload: data }));
    })
    .catch((err) =>
      res.json(response({ success: false, message: err.toString() }))
    );
};

module.exports = {
  userLevelAnswer,
  userLevelMenuAnswer,
  graphReportApiUserLevel,
  chiller,
};
