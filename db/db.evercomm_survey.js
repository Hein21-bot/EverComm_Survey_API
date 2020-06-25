const mysql = require("mysql");
const util = require("util");

require("dotenv").config();

const mypool = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

// login

const login = (email) => {
  query = util.promisify(mypool.query).bind(mypool);
  // console.log(email);

  return query(`CALL userLogin(?);`, [email]);
};

// addUser

const addUser = (userName, password, email, companyName) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL addUser(?,?,?,?,?,?);`, [
    userName,
    password,
    email,
    1,
    2,
    companyName,
  ]);
};

const updateUser = (userId, userName, password, email) => {
  query = util.promisify(mypool.query).bind(mypool);
  // UPDATE tbl_login_users SET user_name = '${userName}', password = '${password}', email = '${email}' WHERE
  // login_user_id = ${userId}
  return query(`CALL updateUser(?,?,?,?);`, [
    userName,
    password,
    email,
    userId,
  ]);
};

//menu

const getMenu = (userId) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`Call getMenu(?);`, [userId]);
};

const getMenuLevl = (userId) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL getMenuLevel()`, [userId]);
};

const checkDuplicateEmailInsert = (email) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL checkDuplicateEmailInsert(?);`, [email]);
};

const checkDuplicateEmailUpdate = (email, user_id) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL checkDuplicateEmailUpdate(?,?);`, [email, user_id]);
};

//Question

const getQuestion = (user_id, survey_header_id, buildingId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(
    `Call getQuestions( ${survey_header_id}, ${user_id},${buildingId});`
  )
}

// answers

const addAnswer = (
  other,
  optionChoiceId,
  userId,
  questionId,
  survey_headers_id,
  building_id,
  keyValue,
  totalQuestionCount
) => {
  query = util.promisify(mypool.query).bind(mypool);
  console.log("--------->",keyValue,'<--------------------------');

  return query(
    `INSERT INTO tbl_answers(other, option_choices_id, users_id, questions_id,survey_headers_id,building_id,keyValue) VALUES 
    ('${other}', ${optionChoiceId}, ${userId}, '${questionId}', ${survey_headers_id}, ${building_id}, ${keyValue});
    UPDATE tbl_buildings SET total_questions = ${totalQuestionCount} WHERE building_id = ${building_id};`
  )
};

// const deleteAnswer = (userId, survey_headers_id, building_id, device_type) => {
//   query = util.promisify(mypool.query).bind(mypool)
//   return query('DELETE FROM tbl_answers WHERE users_id = "' + userId + '"  AND survey_headers_id= "' + survey_headers_id + '" AND building_id="' + building_id + '" AND device_type = "' + device_type + '"')
// }

const deleteAnswer = (userId, survey_headers_id, building_id) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(
    'DELETE FROM tbl_answers WHERE users_id = "' +
    userId +
    '"  AND survey_headers_id= "' +
    survey_headers_id +
    '" AND building_id="' +
    building_id +
    '"'
  );
};

// questions

const addQuestion = (
  questionName,
  required,
  isOther,
  optionGroupId,
  untiId,
  surveySectionId,
  inputTypeId
) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(
    `INSERT INTO tbl_questions(question_name, required, is_other, option_groups_id, units_id, survey_sections_id, input_types_id) 
  VALUES(?,?,?,?,?,?,?)`,
    [
      questionName,
      required,
      isOther,
      optionGroupId,
      untiId,
      surveySectionId,
      inputTypeId
    ]
  );
};

const deleteQuestion = (question_id) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(
    'DELETE FROM tbl_questions WHERE question_id = "' + question_id + '"'
  );
};

const updateQuestion = (
  question_id,
  questionName,
  required,
  isOther,
  optionGroupId,
  untiId,
  surveySectionId,
  inputTypeId
) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`UPDATE tbl_questions SET question_name = '${questionName}', required = ${required}, is_other = ${isOther} , 
  option_groups_id = ${optionGroupId} , units_id = ${untiId} , survey_sections_id = ${surveySectionId} , input_types_id = ${inputTypeId} 
  WHERE question_id = ${question_id} `);
};

// @HeinMinHtet
// AnswerCount

const reportTotalAnswers = (userId, surveyHeaderId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);
  return startDate != null
    ? query(
      `Call reportTotalAnswerDate(${surveyHeaderId},'${startDate}','${endDate}')`
    )
    : query(`Call reportTotalAnswer(${surveyHeaderId})`);
};


const reportDistributorAnswers = (
  userId,
  surveyHeaderId,
  startDate,
  endDate
) => {
  query = util.promisify(mypool.query).bind(mypool);
  return startDate != null
    ? query(
      `Call reportDistributorAnswersDate(${surveyHeaderId},${userId},'${startDate}','${endDate}')`
    )
    : query(`Call reportDistributorAnswers(${surveyHeaderId},${userId})`);
};


const reportUserAnswer = (userId, surveyHeaderId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);
  return startDate != null
    ? query(
      `Call reportUserAnswerDate(${surveyHeaderId},${userId},'${startDate}','${endDate}')`
    )
    : query(`Call reportUserAnswer(${surveyHeaderId},${userId})`);
};

const userLevelAnswer = (userId, surveyHeaderId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL userLevelAnswers(?)`, [userId]);
};

const surveyList = (userId, survey_header_id) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL surveyList(?,?)`, [userId, survey_header_id]);
};

// @hmh
// buildings

const addBuilding = (
  buildingName,
  companyName,
  address,
  postalCode,
  country,
  comment,
  userId,
  surveyHeadersId,
  chiller,
  condenser,
  evaporator,
  coolingTower
) => {
  const query = util.promisify(mypool.query).bind(mypool);
  return query(
    `INSERT INTO tbl_buildings (building_name, company_name, remark, active, address, postal_code,country,comment,user_id,survey_headers_id,chiller,condenser,evaporator,cooling_tower)  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)	
    `,
    [
      buildingName,
      companyName,
      "ok",
      1,
      address,
      postalCode,
      country,
      comment,
      userId,
      surveyHeadersId,
      chiller,
      condenser,
      evaporator,
      coolingTower,
    ]
  );
};

// surveyMenuApi

const surveyMenuApi = (userId) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL surveyMenu(?)`, [userId]);
};


const surveyMenuApiLevel = (userId) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL surveyMenuLevel(?)`, [userId]);
};


const dateTimeMenuApi = (userId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);
  const overAllQuery = `Call reportMenuUserDate(${userId},'${startDate}','${endDate}')`;
  return startDate != null
    ? query(overAllQuery)
    : endDate != null
      ? query(overAllQuery)
      : query(`Call reportMenuUser(${userId})`);
};


const dateTimeMenuAdminApi = (userId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);
  const overAllQuery = `Call reportMenuAdminDate('${startDate}','${endDate}')`;
  return startDate != null
    ? query(overAllQuery)
    : endDate != null
      ? query(overAllQuery)
      : query(`Call reportMenuAdmin()`);
};


const dateTimeMenuDistributorApi = (userId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);

  const overAllQuery = `Call reportMenuDistributorDate(${userId},'${startDate}','${endDate}')`;
  return startDate != null
    ? query(overAllQuery)
    : endDate != null
      ? query(overAllQuery)
      : query(`Call reportMenuDistributor(${userId})`);
};

module.exports = {
  getQuestion,
  login,
  addUser,
  checkDuplicateEmailInsert,
  checkDuplicateEmailUpdate,
  dateTimeMenuDistributorApi,
  reportDistributorAnswers,
  addAnswer,
  deleteAnswer,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  reportTotalAnswers,
  getMenu,
  updateUser,
  getMenuLevl,
  surveyMenuApiLevel,
  surveyList,
  addBuilding,
  surveyMenuApi,
  userLevelAnswer,
  reportUserAnswer,
  dateTimeMenuApi,
  dateTimeMenuAdminApi,
};
