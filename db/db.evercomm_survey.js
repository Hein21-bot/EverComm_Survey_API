const mysql = require("mysql")
const util = require("util")
const moment = require("moment")
const stringifyObject = require('stringify-object');


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
  return query(`SELECT * FROM tbl_login_users WHERE active = 1 AND email = '${email}' AND password = trim('${password}');
  select * from tbl_questions as q left join tbl_survey_headers as h on q.survey_headers_id = h.survey_header_id order by q.survey_headers_id;
  select * from tbl_answers as a where users_id = (select l.login_user_id from tbl_login_users as l where l.email = '${email}') order by 
  a.survey_headers_id;`)
}

// email

const checkDuplicateEmail = (email, user_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('Select Count(*) as DE from tbl_login_users where email = "' + email + '" and login_user_id != "' + user_id + '"')
}

//user

const getAdmin = () => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT * FROM tbl_login_users where user_level _id = 1`)
}

const addUser = (userName, password, email) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_login_users (user_name, password, email,active,user_level_id) VALUES (?,?,?,?,?)`,
    [userName, password, email, 1, 2]
  )
}

//Question 

const getQuestion = (user_id, survey_header_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`select * from tbl_questions as q left join tbl_option_choices as o  on q.question_id = o.questions_id
  left join tbl_survey_sections as s on s.survey_section_id = q.survey_sections_id left join tbl_survey_headers as h
   on h.survey_header_id = s.survey_headers_id where h.survey_header_id = ${survey_header_id} and h.active = true;
   select other,option_choices_id,users_id,questions_id from tbl_answers where users_id = ${user_id} and survey_header_id = ${survey_header_id};`)
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

const addAnswer = (other, optionChoiceId, userId, questionId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_answers(other, option_choices_id, users_id, questions_id) VALUES(?,?,?,?)`,
    [other, optionChoiceId, userId, questionId])
}

const deleteAnswer = (userId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`DELETE FROM tbl_answers WHERE answer_id = '${userId}'`)
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

const AnswerCount = (email) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('SELECT COUNT(questions_id.*) FROM tbl_answers JOIN tbl_login_users tbl_login_users ON tbl_answers.users_id = tbl_login_users.login_user_id where email = "' + email + '" GROUP BY questions_id;')
}


module.exports = {
  getQuestion, login, isExistAdmin, addAdmin, updateAdmin, getAdmin, getAdminById, addUser, checkDuplicateEmail,
  addUnit, deleteUnit, updateUnit, getUnit,
  addHeader, deleteHeader, updateHeader,
  addSection, deleteSection, updateSection,
  addOptionChoice, deleteOptionChoice, updateOptionChoice,
  addOptionGroup, deleteOptionGroup, updateOptionGroup, getOptionGroup,
  addAnswer, deleteAnswer, updateAnswer,
  addInputType, deleteInputType, updateInputType,
  addQuestion, deleteQuestion, updateQuestion, AnswerCount
}


