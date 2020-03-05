const { surveyService } = require('../service')
const response = require('../model/response')
const { surveydb } = require('../db')
var groupArray = require('group-array');

const getQuestion = (req,res) =>{
    const admin_id = req.params.admin_id;
    const survey_header_id = req.params.survey_header_id;
    let count = 0;
    surveyService.getQuestion(admin_id,survey_header_id).then(data => {
    
         let surveySections = Object.keys(groupArray(data,'survey_section_id')).map((v,k)=>{
            return groupArray(data,'survey_section_id')[v];
         });

        let ans = [{"survey_header_id": surveySections[0][0].survey_header_id,"survey_name": surveySections[0][0].survey_name, survey_sections: 
        surveySections.map(section=> {
            count += Object.keys(groupArray(section,'question_id')).length;
            return {"survey_section_id": section[0].survey_section_id,"section_name": section[0].section_name,"questions": 
            Object.keys(groupArray(section,'question_id')).map((v,k)=>{
                return groupArray(section,'question_id')[v];
             }).map((v1,k1)=>{
                 return {"question_id": v1[0].question_id, "question_name": v1[0].question_name,"input_type_id": v1[0].input_types_id, "option_choices": v1.map(c=>{
                     return {"option_choice_id": c.option_choice_id, "option_choice_name": c.option_choice_name}
                 })}
             })
           };
        }),"question_count": count
    }];
        res.json(response({ success: true, payload: ans }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

const addAnswer = (req,res) =>{
    let targetCount = req.body.data.length;
    let count = 0;
    let queryLoop = new Promise((resolve, reject) => {
    req.body.data.map(data=>{
        let other = data.other;
        let optionChoiceId = data.optionChoiceId;
        let userId = data.userId;
        let questionId = data.questionId;
        surveyService.addAnswer(other, optionChoiceId, userId, questionId).then(data => {
            count++;
            if(count == targetCount) resolve({"answeredCount": count});
        }).catch(err => reject(err));
    })
});

queryLoop.then(data => {
    res.json(response({ success: true, payload: data }))
}).catch(err => res.json(response({ success: false, message: err })));
}

module.exports = {getQuestion,addAnswer};