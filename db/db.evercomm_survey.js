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
  console.log(email);

  return query(
    `CALL userLogin(?);`, [email]
  );
};

// addUser

const addUser = (userName, password, email, companyName) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(
    `CALL addUser(?,?,?,?,?,?);`, [userName, password, email, 1, 2, companyName]
  );
};

const updateUser = (userId, userName, password, email) => {
  query = util.promisify(mypool.query).bind(mypool);
  // UPDATE tbl_login_users SET user_name = '${userName}', password = '${password}', email = '${email}' WHERE 
  // login_user_id = ${userId}
  return query(
    `CALL updateUser(?,?,?,?);`, [userName, password, email, userId]
  );
};

//menu

const getMenu = (userId) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(
    `Call getMenu(?);`, [userId]);
};

const getMenuLevl = (userId) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL getMenuLevel()`, [userId]);
};

const checkDuplicateEmailInsert = (email) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(
    `CALL checkDuplicateEmailInsert(?);`, [email]
  );
};

const checkDuplicateEmailUpdate = (email, user_id) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(
    `CALL checkDuplicateEmailUpdate(?,?);`, [email, user_id]
  );
};

//Question

const getQuestion = (user_id, survey_header_id, buildingId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(
    `Call getQuestions(${user_id}, ${survey_header_id}, ${buildingId});`
  )
}

// answers

const addAnswer = (other, optionChoiceId, userId, questionId, survey_headers_id, building_id, device_type, totalQuestionCount) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(
    `Call addAnswers('${other}', ${optionChoiceId}, ${userId}, ${questionId}, ${survey_headers_id}, ${building_id}, ${device_type},${totalQuestionCount})`
  )
}

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

const updateAnswer = (answer_id, other, optionChoiceId, userId, questionId) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL updateAnswer(?,?,?,?,?)`, [answer_id, other, optionChoiceId, userId, questionId]);
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
      inputTypeId,
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
    ? query(`Call reportTotalAnswerDate(${surveyHeaderId},'${startDate}','${endDate}')`)
    : query(`Call reportTotalAnswer(${surveyHeaderId})`);
};

const reportDistributorAnswers = (userId, surveyHeaderId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);
  return startDate != null
    ? query(`Call reportDistributorAnswersDate(${userId},${surveyHeaderId},'${startDate}','${endDate}')`)
    : query(`Call reportDistributorAnswers(${userId},${surveyHeaderId})`);
};

const reportUserAnswer = (userId, surveyHeaderId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);
  return startDate != null
    ? query(`Call reportUserAnswerDate(${userId},${surveyHeaderId},'${startDate}','${endDate}')`)
    : query(`Call reportUserAnswer(${userId},${surveyHeaderId})`);
};

const userLevelAnswer = (userId, surveyHeaderId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(
    `SELECT user_level_id FROM evercomm_survey.tbl_login_users where login_user_id = ${userId};`
  );
};

const surveyList = (userId, survey_header_id) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`SELECT 
  survey_header_id,
  t2.building_id AS building_id,
  b.building_name AS building_name,
  answers,
  b.total_questions As total_question_count,
  (SELECT 
          COUNT(*)
      FROM
          tbl_questions qq
      WHERE
          qq.survey_headers_id = t2.survey_header_id) AS questions
FROM
  (SELECT 
      survey_header_id, building_id, COUNT(acount) AS answers
  FROM
      (SELECT DISTINCT
      a.questions_id AS qcount,
          a.questions_id AS acount,
          q.survey_headers_id AS survey_header_id,
          h.survey_name AS survey_header_name,
          a.building_id AS building_id
  FROM
      tbl_questions AS q
LEFT JOIN tbl_answers a ON q.survey_headers_id = a.survey_headers_id
AND a.users_id = ${userId}
  LEFT JOIN tbl_survey_headers h ON h.survey_header_id = q.survey_headers_id
  LEFT JOIN tbl_buildings b ON a.building_id = b.building_id
  WHERE
      q.survey_headers_id = ${survey_header_id}
          AND a.building_id != ''
          AND b.active = 1) AS t1
  GROUP BY survey_header_id , building_id) AS t2
      LEFT JOIN
  tbl_buildings b ON b.building_id = t2.building_id;
        SELECT distinct tbl_buildings.user_id,tbl_buildings.survey_headers_id,
          tbl_buildings.building_id,tbl_buildings.building_name FROM
            evercomm_survey.tbl_buildings inner join evercomm_survey.tbl_answers on
              tbl_buildings.user_id = ${userId} and tbl_buildings.survey_headers_id=${survey_header_id};`);
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
    `INSERT INTO tbl_buildings(building_name, company_name, remark, active, created_by, address, postal_code,country,
    comment,user_id,survey_headers_id,chiller,condenser,evaporator,cooling_tower) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      buildingName,
      companyName,
      "ok",
      1,
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
  return query(`SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey,section_name,survey_section_id,created_date
  FROM (
    select 
      distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name ,
      ss.section_name as section_name,ss.survey_section_id as survey_section_id,sh.created_date as created_date
        from tbl_survey_headers as sh 
          left join tbl_answers a on sh.survey_header_id=a.survey_headers_id and a.users_id = ${userId}
          left join tbl_survey_sections ss on sh.survey_header_id = ss.survey_headers_id
            ) as t1 group by survey_header_id,section_name,survey_section_id;`);
};

const surveyMenuApiLevel = (userId) => {
  query = util.promisify(mypool.query).bind(mypool);
  return query(`SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey,section_name,survey_section_id,created_date
  FROM (
    select 
      distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name ,
      ss.section_name as section_name,ss.survey_section_id as survey_section_id,sh.created_date as created_date
        from tbl_survey_headers as sh 
          left join tbl_answers a on sh.survey_header_id=a.survey_headers_id and a.users_id = ${userId}
          left join tbl_survey_sections ss on sh.survey_header_id = ss.survey_headers_id
          right join tbl_user_survey us on us.survey_header_id = sh.survey_header_id and us.user_id = ${userId}
            ) as t1 where t1.survey_name != "" group by survey_header_id,section_name,survey_section_id;`);
};

const dateTimeMenuApi = (userId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);
  // console.log("startDate is ==>", startDate)
  const overAllQuery = `Call reportMenuUserDate(${userId},'${startDate}','${endDate}')`;
  return startDate != null
    ? query(overAllQuery)
    : endDate != null
      ? query(overAllQuery)
      : query(`Call reportMenuUser(${userId})`);
};

const dateTimeMenuAdminApi = (userId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool);
  // console.log("startDate is ==>", startDate)
  const overAllQuery = `Call reportMenuDate('${startDate}','${endDate}')`;
  return startDate != null
    ? query(overAllQuery)
    : endDate != null
      ? query(overAllQuery)
      : query(`Call reportMenu()`);
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
  updateAnswer,
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
