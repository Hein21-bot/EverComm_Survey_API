const mysql = require("mysql")
const util = require("util")
const bcrypt = require("bcrypt")
const saltRounds = 10

require('dotenv').config()

const mypool = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true
});

// login

const login = (email, password) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT * FROM tbl_login_users WHERE active = 1 AND email = '${email}';`)
}

// addUser

// const addUser = (userName, password, email, companyName) => {

//   bcrypt.hash(password, saltRounds, function (err, hash) {
//     query = util.promisify(mypool.query).bind(mypool)
//     return query(`INSERT INTO tbl_login_users(user_name,password,email,active,user_level_id,company_name) VALUES(?,?,?,?,?,?)`, [userName, hash, email, 1, 2, companyName])
//   })
// }

const addUser = (userName, password, email, companyName) => {

  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_login_users(user_name,password,email,active,user_level_id,company_name) VALUES(?,?,?,?,?,?)`, [userName, password, email, 1, 2, companyName])

}


//menu 

const getMenu = (userId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`select survey_header_id, survey_header_name, count(qcount) as questions, count(acount) as answers
  from (
    SELECT
      distinct q.question_id as qcount, a.questions_id as acount, q.survey_headers_id as survey_header_id,h.survey_name as survey_header_name
    FROM
      tbl_questions as q
    left join tbl_answers a on q.survey_headers_id=a.survey_headers_id and q.question_id=a.questions_id and a.users_id = ${userId} 
      left join tbl_survey_headers h on h.survey_header_id = q.survey_headers_id
    group by q.question_id
  ) as t1
  group by survey_header_id;`);
}

// email

const checkDuplicateEmailInsert = (email) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`Select Count(*) as DE from tbl_login_users where email = '${email}'`)
}

const checkDuplicateEmailUpdate = (email, user_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`Select Count(*) as DE from tbl_login_users where email = '${email}' and login_user_id != ${user_id}`)
}

//user

const getAdmin = () => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT * FROM tbl_login_users where user_level _id = 1`)
}

const getCompany = () => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('Select company_id,company_name from tbl_company')
}


const addCompany = (companyName) => {
  query = util.promisify(mypool.query).bind(mypool)
  return (`Insert into tbl_company(company_name,remark,active,created_by) Values (${companyName},"ok",1,1)`)

}

// @HMH

const updateUser = (userId, userName, password, email, companyId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_login_users SET user_name = '${userName}', password = '${password}', email = '${email}',company_id=${companyId} WHERE login_user_id = ${userId} `)
}

//Question 

const getQuestion = (user_id, survey_header_id, buildingId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`select * from tbl_questions as q left join tbl_option_choices as o  on q.question_id = o.questions_id
  left join tbl_survey_sections as s on s.survey_section_id = q.survey_sections_id left join tbl_survey_headers as h
   on h.survey_header_id = s.survey_headers_id where h.survey_header_id = ${survey_header_id} and h.active = true;
   select other,option_choices_id as optionChoiceId,users_id as userId,questions_id as questionId, survey_headers_id,building_id from tbl_answers where users_id = ${user_id} and survey_headers_id = ${survey_header_id} and building_id = ${buildingId};`)
}

const isExistAdmin = (username, userId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT * FROM tbl_user WHERE username = '${username}' && userId <> ${userId} `)
}

const addAdmin = (username, password, active, employeeId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_user(username, password, active, employeeId) VALUES(?,?,?,?)`, [username, password, active, employeeId])
}

const updateAdmin = (userId, username, password, active, employeeId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_user SET username = '${username}', password = '${password}', active = ${active}, employeeId = ${employeeId} WHERE userId = ${userId} `)
}

const getAdminById = (userId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT * FROM tbl_user WHERE userId = ${userId} `)
}

//unit
const getUnit = () => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`Select * from tbl_units`)
}


const addUnit = (units) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_units(unit_name) VALUES(?)`,
    [units]
  )
}

const deleteUnit = (unit_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('DELETE FROM tbl_units WHERE unit_id = "' + unit_id + '"')
}

const updateUnit = (unit_id, units) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_units SET unit_name = ('${units}') WHERE unit_id = ${unit_id} `)
}

// survey_header

const addHeader = (surveyname, remark, active, adminId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_survey_headers(survey_name, remark, active, admin_id) VALUES(?,?,?,?)`,
    [surveyname, remark, active, adminId])
}

const deleteHeader = (header_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('DELETE FROM tbl_survey_headers WHERE survey_header_id = "' + header_id + '"')
}

const updateHeader = (header_id, surveyname, remark, active, adminId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_survey_headers SET survey_name = ('${surveyname}'), remark = ('${remark}'), active = ${active} , admin_id = ('${adminId}') WHERE survey_header_id = ${header_id} `)
}

// survey_section

const addSection = (sectionName, pageNo, active, surveyHeaderId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_survey_sections(section_name, page_no, active, survey_headers_id) VALUES(?,?,?,?)`,
    [sectionName, pageNo, active, surveyHeaderId])
}

const deleteSection = (section_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('DELETE FROM tbl_survey_sections WHERE survey_id = "' + section_id + '"')
}

const updateSection = (section_id, sectionName, pageNo, active, surveyHeaderId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_survey_sections SET section_name = '${sectionName}', page_no = ${pageNo}, active = ${active} , survey_headers_id = ${surveyHeaderId} WHERE survey_id = ${section_id} `)
}

// option_choice

const addOptionChoice = (optionChoiceName, questionId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_option_choices(option_choice_name, questions_id) VALUES(?,?)`,
    [optionChoiceName, questionId])
}

const deleteOptionChoice = (option_choice_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('DELETE FROM tbl_option_choices WHERE option_choice_id = "' + option_choice_id + '"')
}

const updateOptionChoice = (option_choice_id, optionChoiceName, questionId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_option_choices SET option_choice_name = '${optionChoiceName}', questions_id = ${questionId} WHERE option_choice_id = ${option_choice_id} `)
}

// option_Group

const getOptionGroup = () => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`Select * from tbl_option_groups`)
}

const addOptionGroup = (optionGroupName) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_option_groups(option_group_name) VALUES(?)`,
    [optionGroupName])
}

const deleteOptionGroup = (option_group_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('DELETE FROM tbl_option_groups WHERE option_group_id = "' + option_group_id + '"')
}

const updateOptionGroup = (option_group_id, optionGroupName) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_option_groups SET option_group_name = '${optionGroupName}' WHERE option_group_id = ${option_group_id} `)
}

// answers

const addAnswer = (other, optionChoiceId, userId, questionId, survey_headers_id, building_id) => {
  // console.log("User Id is ==>",userId,"Other is==>", other)
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_answers(other, option_choices_id, users_id, questions_id,survey_headers_id,building_id) VALUES(?,?,?,?,?,?)`,
    [other, optionChoiceId, userId, questionId, survey_headers_id, building_id])
}

const deleteAnswer = (userId, survey_headers_id, building_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('DELETE FROM tbl_answers WHERE users_id = "' + userId + '"  AND survey_headers_id= "' + survey_headers_id + '" AND building_id="' + building_id + '"')
}


const updateAnswer = (answer_id, other, optionChoiceId, userId, questionId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_answers SET other = '${other}', option_choices_id = ${optionChoiceId}, users_id = ${userId} , questions_id = ${questionId} WHERE answer_id = ${answer_id} `)
}

// input_type

const addInputType = (name) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_input_types(name) VALUES(?)`,
    [name])
}

const deleteInputType = (input_type_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('DELETE FROM tbl_input_types WHERE input_type_id = "' + input_type_id + '"')
}

const updateInputType = (input_type_id, name) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_input_types SET name = '${name}' WHERE input_type_id = ${input_type_id} `)
}

// questions

const addQuestion = (questionName, required, isOther, optionGroupId, untiId, surveySectionId, inputTypeId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_questions(question_name, required, is_other, option_groups_id, units_id, survey_sections_id, input_types_id) VALUES(?,?,?,?,?,?,?)`,
    [questionName, required, isOther, optionGroupId, untiId, surveySectionId, inputTypeId])
}


const deleteQuestion = (question_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('DELETE FROM tbl_questions WHERE question_id = "' + question_id + '"')
}

const updateQuestion = (question_id, questionName, required, isOther, optionGroupId, untiId, surveySectionId, inputTypeId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_questions SET question_name = '${questionName}', required = ${required}, is_other = ${isOther} , option_groups_id = ${optionGroupId} , units_id = ${untiId} , survey_sections_id = ${surveySectionId} , input_types_id = ${inputTypeId} WHERE question_id = ${question_id} `)
}

// @HeinMinHtet
// AnswerCount

const reportTotalAnswers = (survey_header_id,survey_section_id) => {
  console.log("Answer count",survey_header_id)
  query = util.promisify(mypool.query).bind(mypool)
  return query(`select acount ,oc.option_choice_name, q.question_name,q.question_id,sh.survey_name,ss.section_name,sh.survey_header_id,ss.survey_section_id
  from(SELECT count(option_choices_id)as acount,option_choices_id FROM evercomm_survey.tbl_answers where  option_choices_id !=""
   GROUP BY option_choices_id) as t1 right join 
   evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t1.option_choices_id
   left join evercomm_survey.tbl_questions q on oc.questions_id = q.question_id 
   left join evercomm_survey.tbl_survey_headers sh on sh.survey_header_id = q.survey_headers_id 
   left join evercomm_survey.tbl_survey_sections ss on ss.survey_section_id = q.survey_sections_id where survey_header_id = ${survey_header_id} and survey_section_id = ${survey_section_id}`)
}

const getFormInfo = (companyId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return companyId != 0 ? query(`select b.building_id,b.building_name,b.address,c.company_id,c.company_name from tbl_buildings as b left join tbl_company as c on b.company_id = c.company_id where b.active = true AND c.company_id = ${companyId}`)
    : query(`select b.building_id,b.building_name,b.address,c.company_id,c.company_name from tbl_buildings as b left join tbl_company as c on b.company_id = c.company_id where b.active = true`)
}

// select survey_header_id,bd.building_id as building_id, bd.building_name as building_name,  count(qcount) as questions, count(acount) as answers

const surveyList = (userId, survey_header_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`
  select survey_header_id, t2.building_id as building_id, b.building_name as building_name, answers, (select count(*) from tbl_questions qq 
    where qq.survey_headers_id=t2.survey_header_id
  ) as questions
  from (
  select survey_header_id, building_id, count(qcount) as questions, count(acount) as answers
    from (
      SELECT
        distinct  q.question_id as qcount, a.questions_id as acount, q.survey_headers_id as survey_header_id,h.survey_name as survey_header_name,a.building_id as building_id
      FROM
        tbl_questions as q
      left join tbl_answers a on q.survey_headers_id=a.survey_headers_id and q.question_id=a.questions_id and a.users_id = ${userId}
      left join tbl_survey_headers h on h.survey_header_id = q.survey_headers_id   
     where q.survey_headers_id=${survey_header_id} and a.building_id!=""
    ) as t1 
    group by survey_header_id, building_id
    ) as t2
    left join tbl_buildings b on b.building_id=t2.building_id;
    SELECT distinct tbl_buildings.user_id,tbl_buildings.survey_headers_id,
      tbl_buildings.building_id,tbl_buildings.building_name FROM
      evercomm_survey.tbl_buildings inner join evercomm_survey.tbl_answers on
      tbl_buildings.user_id = ${userId} and tbl_buildings.survey_headers_id=${survey_header_id}`)
}

const newSurveyList = (userId, survey_header_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT distinct tbl_buildings.user_id,tbl_buildings.survey_headers_id,
  tbl_buildings.building_id,tbl_buildings.building_name FROM
  evercomm_survey.tbl_buildings inner join evercomm_survey.tbl_answers on
  tbl_buildings.user_id = ${userId} and tbl_buildings.survey_headers_id=${survey_header_id}`)
}


// @hmh
// buildings

const addBuilding = (buildingName, companyName, address, postalCode, country, comment, userId, surveyHeadersId) => {
  console.log("building info is Zzzzz ==>", userId, surveyHeadersId)
  const query = util.promisify(mypool.query).bind(mypool)
  console.log("pass")
  return query(`INSERT INTO tbl_buildings(building_name, company_name, remark, active, created_by, address, postal_code,country,comment,user_id,survey_headers_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    [buildingName, companyName, 'ok', 1, 1, address, postalCode, country, comment, userId, surveyHeadersId])
}

// surveyMenuApi

const surveyMenuApi = (userId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey
  FROM (
   select 
   distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name 
  from tbl_survey_headers as sh 
  left join tbl_answers a on sh.survey_header_id=a.survey_headers_id and a.users_id = ${userId}
  ) as t1
   group by survey_header_id`)
}


module.exports = {
  getQuestion, login, isExistAdmin, addAdmin, updateAdmin, getAdmin, getAdminById, addUser, checkDuplicateEmailInsert, checkDuplicateEmailUpdate,
  addUnit, deleteUnit, updateUnit, getUnit,
  addHeader, deleteHeader, updateHeader,
  addSection, deleteSection, updateSection,
  addOptionChoice, deleteOptionChoice, updateOptionChoice,
  addOptionGroup, deleteOptionGroup, updateOptionGroup, getOptionGroup,
  addAnswer, deleteAnswer, updateAnswer,
  addInputType, deleteInputType, updateInputType,
  addQuestion, deleteQuestion, updateQuestion, reportTotalAnswers,
  getMenu, updateUser,
  getFormInfo, getCompany, addCompany, surveyList, addBuilding,
  surveyMenuApi, newSurveyList
}

// SELECT count(option_choices_id),option_choices_id,questions_id FROM tbl_answers where survey_headers_id = 1 and option_choices_id !=""
// GROUP BY questions_id,option_choices_id;
// select count(distinct users_id) as gg from tbl_answers where survey_headers_id = 1



