const { loginService } = require('../service')
const response = require('../model/response')
var groupArray = require('group-array');

const logIn = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    loginService.login(email, password).then(data => {
        let tmpArr = [];
        let data1 = groupArray(data[1],'survey_headers_id');
        let data2 = groupArray(data[2],'survey_headers_id');

        Object.keys(data1).map((v,k)=>{
            return {"surveyId": data1[v][0].survey_header_id, "quetionLength": data1[v].length
        , "surveyName": data1[v][0].survey_name };
         }).map(v=>{
            let obj = {"survey_header_id": null,"survey_header_name": null,"questions": 0,"answers": 0};
            obj.survey_header_id = v.surveyId;
            obj.survey_header_name = v.surveyName;
            obj.questions = v.quetionLength;    
            tmpArr.push(obj);
         })

         Object.keys(data2).map((v,k)=>{
            return {"answerLength": data2[v].length,"surveyId": data2[v][0].survey_headers_id};
         }).map(v=>{
             let ind = tmpArr.findIndex(d=>  d.survey_header_id == v.surveyId);
             if(ind >= 0) tmpArr[ind].answers = v.answerLength;
         });
        
        if (data.length === 0) {
            res.json(response({ success: false, message: "Email or Password Incorrect!", payload: null }))
        }
        else {
            res.json(response({ success: true, message: "Success", payload: {"user_info": data[0], "survey_info": tmpArr}}))
        }
    }).catch(err => console.log(err))
};

module.exports = { logIn }
