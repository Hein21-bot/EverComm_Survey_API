const { reportTotalAnswersService } = require("../service");
const response = require("../model/response");
var groupArray = require("group-array");
const { xssFilter } = require("helmet");

const userLevelAnswer = (req, res) => {
  let surveyHeaderId = req.params.surveyHeaderId;
  const userId = req.body.userId;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const viewType = req.body.viewType;

  reportTotalAnswersService.userLevelAnswer(userId, surveyHeaderId, startDate, endDate, viewType).then((data) => {

    data(userId, surveyHeaderId, startDate, endDate).then((data) => {

      let surveySections = Object.keys(groupArray(data[0], "survey_section_id")).map((v, k) => {
        return groupArray(data[0].filter((d) => d.input_type_id !== null), "survey_section_id")[v];
      });

      let ans = [{
        "survey_header_id": surveySections[0][0].survey_header_id, "survey_name": surveySections[0][0].survey_name,
        "Number_of_buildings": surveySections[0][0].Number_of_buildings, "survey_sections":
          surveySections.map(section => {
            return {
              "survey_section_id": section[0].survey_section_id, "section_name": section[0].section_name, "questions":
                Object.keys(groupArray(section, 'question_id')).map((v, k) => {
                  return groupArray(section, 'question_id')[v]
                }).map((v1, k1) => {
                  return {
                    "question_id": v1[0].question_id, "question_name": v1[0].question_name, "input_type_id": v1[0].input_type_id,
                    "totalAnsCount": v1[0].atcount != null ? v1[0].atcount : 0, "option_choices": v1.map(c => {
                      return {
                        "option_choice_name": c.option_choice_name, "totalAns": c.acount != null ? c.acount : 0,
                        "other": c.other != null && c.other.includes('{') ?
                          JSON.parse(c.other) : c.other
                      }
                    })
                  }
                })
            };
          }), "building_count": data[1]
      }];
      res.json(response({ success: true, payload: ans }));
    })
      .catch((err) =>
        res.json(response({ success: false, message: err.toString() }))
      );
  });
};

const userLevelMenuAnswer = (req, res) => {
  let surveyHeaderId = req.params.surveyHeaderId;
  const userId = req.params.userId;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const viewType = req.body.viewType;

  reportTotalAnswersService
    .userLevelMenuAnswer(userId, surveyHeaderId, startDate, endDate, viewType)
    .then((data) => {
      data(userId, startDate, endDate).then((data) => {
        let surveySections = Object.keys(groupArray(data[0], "survey_header_id")).map((v, k) => {
          return groupArray(data[0], "survey_header_id")[v];
        }).map((v1, k1) => {
          return {
            survey_header_id: v1[0].survey_header_id, survey_name: v1[0].survey_name, survey_created_date: v1[0].created_date.toString(),
            amount_of_survey: Object.keys(groupArray(v1, "buildings_id")).map((v2, k2) => {
              return groupArray(v1, "buildings_id")[v2];
            }).map((v3, k3) => {
              return {
                building_id: v3[0].buildings_id,
                building_name: v3[0].building_name,
              };
            }),
            survey_section: Object.keys(groupArray(v1, "survey_section_id")).map((v4, k4) => {
              return groupArray(v1, "survey_section_id")[v4];
            }).map((v5, k5) => {
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

// const typeAndArea = (req, res) => {
//   reportTotalAnswersService.typeAndArea()
//     .then(data => {
//       res.json(response({ success: true, payload: data }));
//     })
//     .catch((err) =>
//       res.json(response({ success: false, message: err.toString() }))
//     );
// }

// const typeAndBMS = (req, res) => {
//   reportTotalAnswersService.typeAndBMS()
//     .then(data => {
//       let surveySections = Object.keys(groupArray(data, "building_type")).map((v, k) => {
//         return groupArray(data, "building_type")[v];
//       }).map((v1, k1) => {
//         return {
//           building_type: v1[0].building_type, categories: Object.keys(groupArray(v1, "option_choice_name")).map((v2, k2) => {
//             return groupArray(v1, "option_choice_name")[v2]
//           }).map((v3, k3) => {
//             return {
//               option_choice_name: v3[0].option_choice_name
//             }
//           }).map((categories => {
//             return categories.option_choice_name
//           })),
//           data: Object.keys(groupArray(v1, "option_choice_name")).map((v4, k4) => {
//             return groupArray(v1, "option_choice_name")[v4];
//           }).map((v5, k5) => {
//             return {
//               option_count: v5[0].option_count,
//             };
//           }).map((categories => {
//             return categories.option_count
//           })),
//           y: Object.keys(groupArray(v1, "option_choice_name")).map((v4, k4) => {
//             return groupArray(v1, "option_choice_name")[v4];
//           }).map((v5, k5) => {
//             return {
//               option_count: v5[0].option_count,
//             };
//           }).map((categories => {
//             return categories.option_count
//           })).reduce(function (accumulator, currentValue, currentIndex, array) {
//             return accumulator + currentValue
//           })
//         }
//       })

//       res.json(response({ success: true, payload: surveySections }));
//     })
//     .catch((err) =>
//       res.json(response({ success: false, message: err.toString() }))
//     );
// }

// const age = (req, res) => {
//   reportTotalAnswersService.age().then(data => {
//     res.json(response({ success: true, payload: data }));
//   })
//     .catch((err) => res.json(response({ success: false, message: err })));
// };


// const graphReportApi = (req, res) => {
//   reportTotalAnswersService.graphReportApi().then(data => {
//     let surveySections1 = Object.keys(groupArray(data[0], "option_choice_name")).map((v, k) => {
//       return groupArray(data[0], "option_choice_name")[v];
//     }).map((v1, k1) => {
//       return {
//         option_choice_name: v1[0].option_choice_name,
//         categories: Object.keys(groupArray(v1, "building_type")).map((v2, k2) => {
//           return groupArray(v1, "building_type")[v2]
//         }).map((v3, k3) => {
//           return {
//             building_type: v3[0].building_type.replace(/\s/g, ''),
//             optionCount: v3[0].optionCount
//           }
//         }).map((categories => {
//           let rObj = {}
//           rObj[categories.building_type.trim()] = categories.optionCount
//           return rObj
//         })).reduce(((r, c) => Object.assign(r, c)), {})
//       }
//     })

//     let surveySections2 = Object.keys(groupArray(data[1], "building_type")).map((v, k) => {
//       return groupArray(data[1], "building_type")[v];
//     }).map((v1, k1) => {
//       return {
//         name: v1[0].building_type, categories: Object.keys(groupArray(v1, "option_choice_name")).map((v2, k2) => {
//           return groupArray(v1, "option_choice_name")[v2]
//         }).map((v3, k3) => {
//           return {
//             option_choice_name: v3[0].option_choice_name
//           }
//         }).map((categories => {
//           return categories.option_choice_name
//         })),
//         data: Object.keys(groupArray(v1, "option_choice_name")).map((v4, k4) => {
//           return groupArray(v1, "option_choice_name")[v4];
//         }).map((v5, k5) => {
//           return {
//             option_count: v5[0].option_count,
//           };
//         }).map((categories => {
//           return categories.option_count
//         })),
//         y: Object.keys(groupArray(v1, "option_choice_name")).map((v4, k4) => {
//           return groupArray(v1, "option_choice_name")[v4];
//         }).map((v5, k5) => {
//           return {
//             option_count: v5[0].option_count,
//           };
//         }).map((categories => {
//           return categories.option_count
//         })).reduce(function (accumulator, currentValue, currentIndex, array) {
//           return accumulator + currentValue
//         })
//       }
//     })

//     let ans = [data[2], surveySections1, surveySections2]

//     res.json(response({ success: true, payload: ans }));
//   })
//     .catch((err) => res.json(response({ success: false, message: err })));
// };

const graphReportApiUserLevel = (req, res) => {
  const userId = req.body.userId
  const startDate = req.body.startDate
  const endDate = req.body.endDate
  const viewType = req.body.viewType
  reportTotalAnswersService.graphReportUserLevel(userId, startDate, endDate, viewType).then((data) => {
    data(userId, startDate, endDate, viewType).then((data) => {
      // console.log(data)

      let surveySections = Object.keys(groupArray(data[2], "building_type")).map((v, k) => {
        return groupArray(data[2], "building_type")[v];
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
          })
          .map((categories => {
            let rObj = {}
            rObj[categories.option_choice_name.trim()] = categories.buildingCount
            return rObj
          }),[])
          .reduce(((r, c) => Object.assign(r, c)), {})
        }
      })

      let surveySections1 = Object.keys(groupArray(data[0], "option_choice_name")).map((v, k) => {
        return groupArray(data[0], "option_choice_name")[v];
      }).map((v1, k1) => {
        return {
          option_choice_name: v1[0].option_choice_name,
          categories: Object.keys(groupArray(v1, "building_type")).map((v2, k2) => {
            return groupArray(v1, "building_type")[v2]
          }).map((v3, k3) => {
            return {
              building_type: v3[0].building_type.replace(/\s/g, ''),
              optionCount: v3[0].optionCount
            }
          }).map((categories => {
            let rObj = {}
            rObj[categories.building_type.trim()] = categories.optionCount
            return rObj
          })).reduce(((r, c) => Object.assign(r, c)), {})
        }
      })

      const result1 = surveySections1.map(v=>{
        const values = Object.values(v.categories)
        const sumValue = values.reduce((r,c) => r+c,0)
        return ({...v,count:sumValue})
      })

      let surveySections2 = Object.keys(groupArray(data[1], "option_choice_name")).map((v, k) => {
        return groupArray(data[1], "option_choice_name")[v];
      })
      .map((v1, k1) => {
        return {
          name: v1[0].option_choice_name, categories: Object.keys(groupArray(v1, "building_type")).map((v2, k2) => {
            return groupArray(v1, "building_type")[v2]
          })
    .map((v3, k3) => {
            return {
              building_type: v3[0].building_type
            }
          })
    .map((categories => {
            return categories.building_type
          })),
          data: Object.keys(groupArray(v1, "building_type")).map((v4, k4) => {
            return groupArray(v1, "building_type")[v4];
          })
    .map((v5, k5) => {
            return {
              option_count: v5[0].option_count,
            };
          })
    .map((categories => {
            return categories.option_count
          })),
          y: Object.keys(groupArray(v1, "building_type")).map((v4, k4) => {
            return groupArray(v1, "building_type")[v4];
          })
    .map((v5, k5) => {
            return {
              option_count: v5[0].option_count,
            };
          }).map((categories => {
            return categories.option_count
          })).reduce(function (accumulator, currentValue, currentIndex, array) {
            return accumulator + currentValue
          })
        }
      })

      let surveySections3 = Object.keys(groupArray(data[3], "building_type")).map((v, k) => {
        return groupArray(data[3], "building_type")[v];
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

      let surveySections4 = Object.keys(groupArray(data[4], "other")).map((v, k) => {
        return groupArray(data[4], "other")[v];
      }).map((v1, k1) => {
        return {
          years: v1[0].other,
          categories: Object.keys(groupArray(v1, "option_choice_name")).map((v2, k2) => {
            return groupArray(v1, "option_choice_name")[v2]
          }).map((v3, k3) => {
            return {
              option_choice_name: v3[0].option_choice_name.replace(/\s/g, ''),
              optionCount: v3[0].optionCount
            }
          }).map((categories => {
            let rObj = {}
            rObj[categories.option_choice_name.trim()] = categories.optionCount
            return rObj0
          })).reduce(((r, c) => Object.assign(r, c)), {})
        }
      })
      // console.log(surveySections4)

      const result = surveySections4.map(v=>{
        const values = Object.values(v.categories)
        const sumValue = values.reduce((r,c) => r+c,0)
        return ({...v,count:sumValue})
      })
      // console.log("result",result)

//       const resultedData = data[4].reduce((r,c)=>{
//        const R = [...r]
//         const index  = R.findIndex(v=>v.year == c.other)
//         if(index == -1){
//           R.push({year:c.other,count:c.optionCount})
//         }
//         else{
//           const count1 =R[index].count 
//           R[index].count = c.optionCount+count1
//         }
//         return R
//       },[])

// console.log(resultedData,"rrr")
      let ans = [surveySections, result1, surveySections2, reultedData, result]



      res.json(response({ success: true, payload: ans }));
    })
      .catch((err) =>
        res.json(response({ success: false, message: err.toString() }))
      );
  })
}

const chiller = (req, res) => {
  reportTotalAnswersService.chiller().then((data) => {

    res.json(response({ success: true, payload: data }));
  }).catch((err) =>
    res.json(response({ success: false, message: err.toString() }))
  );
}


module.exports = { userLevelAnswer, userLevelMenuAnswer, graphReportApiUserLevel, chiller };
