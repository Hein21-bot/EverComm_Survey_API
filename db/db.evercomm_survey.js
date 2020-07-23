const mysql = require("mysql");
const util = require("util");
const { query } = require("express");

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
  let query = util.promisify(mypool.query).bind(mypool);
  // console.log(email);

  return query(`CALL userLogin(?);`, [email]);
};

// addUser

const addUser = (userName, password, email, companyName) => {
  let query = util.promisify(mypool.query).bind(mypool);
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
  let query = util.promisify(mypool.query).bind(mypool);
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
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`Call getMenu(?);`, [userId]);
};

const getMenuLevl = (userId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL getMenuLevel()`, [userId]);
};

const checkDuplicateEmailInsert = (email) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL checkDuplicateEmailInsert(?);`, [email]);
};

const checkDuplicateEmailUpdate = (email, user_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL checkDuplicateEmailUpdate(?,?);`, [email, user_id]);
};

//Question

const getQuestion = (user_id, survey_header_id, buildingId) => {
  let query = util.promisify(mypool.query).bind(mypool)
  return query(
    `Call getQuestions( ${survey_header_id}, ${user_id},${buildingId});`
  );
};

// answers

const addAnswer = (
  other,
  optionChoiceId,
  userId,
  questionId,
  survey_headers_id,
  building_id,
  keyValue,
  totalQuestionCount,
  answeredDate,
  buildingType
) => {
  let query = util.promisify(mypool.query).bind(mypool);
  // console.log(answeredDate,keyValue);

  return query(
    `INSERT INTO tbl_answers(other, option_choices_id, users_id, questions_id,survey_headers_id,building_id,answered_date,keyValue) VALUES 
    ('${other}', ${optionChoiceId}, ${userId}, '${questionId}', ${survey_headers_id}, ${building_id}, '${answeredDate}',${keyValue});
    UPDATE tbl_buildings SET total_questions = ${totalQuestionCount},building_type = '${buildingType}' WHERE building_id = ${building_id};`
  )
};

// const deleteAnswer = (userId, survey_headers_id, building_id, device_type) => {
//   query = util.promisify(mypool.query).bind(mypool)
//   return query('DELETE FROM tbl_answers WHERE users_id = "' + userId + '"  AND survey_headers_id= "' + survey_headers_id + 
// '" AND building_id="' + building_id + '" AND device_type = "' + device_type + '"')
// }

const deleteAnswer = (userId, survey_headers_id, building_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
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
  let query = util.promisify(mypool.query).bind(mypool);
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
  let query = util.promisify(mypool.query).bind(mypool);
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
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`UPDATE tbl_questions SET question_name = '${questionName}', required = ${required}, is_other = ${isOther} , 
  option_groups_id = ${optionGroupId} , units_id = ${untiId} , survey_sections_id = ${surveySectionId} , input_types_id = ${inputTypeId} 
  WHERE question_id = ${question_id} `);
};

// @HeinMinHtet
// AnswerCount

const reportTotalAnswers = (userId, surveyHeaderId, startDate, endDate) => {
  let query = util.promisify(mypool.query).bind(mypool);
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
  let query = util.promisify(mypool.query).bind(mypool);
  return startDate != null
    ? query(
      `Call reportDistributorAnswersDate(${surveyHeaderId},${userId},'${startDate}','${endDate}')`
    )
    : query(`Call reportDistributorAnswers(${surveyHeaderId},${userId})`);
};

const reportUserAnswer = (userId, surveyHeaderId, startDate, endDate) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return startDate != null
    ? query(
      `Call reportUserAnswerDate(${surveyHeaderId},${userId},'${startDate}','${endDate}')`
    )
    : query(`Call reportUserAnswer(${surveyHeaderId},${userId})`);
};

const userLevelAnswer = (userId, surveyHeaderId, startDate, endDate) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL userLevelAnswers(?)`, [userId]);
};

const surveyList = (userId, survey_header_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
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
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `INSERT INTO tbl_buildings (building_name, company_name, remark, active, address, postal_code,country,comment,
      user_id,survey_headers_id,chiller,condenser,evaporator,cooling_tower)  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)	
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
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL surveyMenu(?)`, [userId]);
};

const surveyMenuApiLevel = (userId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL surveyMenuLevel(?)`, [userId]);
};

const dateTimeMenuApi = (userId, startDate, endDate) => {
  let query = util.promisify(mypool.query).bind(mypool);
  const overAllQuery = `Call reportMenuUserDate(${userId},'${startDate}','${endDate}')`;
  return startDate != null
    ? query(overAllQuery)
    : endDate != null
      ? query(overAllQuery)
      : query(`Call reportMenuUser(${userId})`);
};

const dateTimeMenuAdminApi = (userId, startDate, endDate) => {
  let query = util.promisify(mypool.query).bind(mypool);
  const overAllQuery = `Call reportMenuAdminDate('${startDate}','${endDate}')`;
  return startDate != null
    ? query(overAllQuery)
    : endDate != null
      ? query(overAllQuery)
      : query(`Call reportMenuAdmin()`);
};

const dateTimeMenuDistributorApi = (userId, startDate, endDate) => {
  let query = util.promisify(mypool.query).bind(mypool);

  const overAllQuery = `Call reportMenuDistributorDate(${userId},'${startDate}','${endDate}')`;
  return startDate != null
    ? query(overAllQuery)
    : endDate != null
      ? query(overAllQuery)
      : query(`Call reportMenuDistributor(${userId})`);
};

const typeAndArea = (startDate, endDate) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return startDate != null
    ?
    query(`select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(a.option_choices_id) as optionCount from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 3
  and a.answered_date between '${startDate}' and '${endDate}'
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id`)
    : query(`select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(a.option_choices_id) as optionCount from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 3
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id`)
}

// const typeAndBMS = () => {
//   let query = util.promisify(mypool.query).bind(mypool);
//    return query(`select oc.option_choice_id,tb.building_type,oc.option_choice_name,count(a.option_choices_id) option_count from evercomm_survey.tbl_answers as a  
//    left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
//    left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue =6
//    group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id`)
//  }

//  const age = () => {
//   let query = util.promisify(mypool.query).bind(mypool);
//   return query(`SELECT oc.option_choice_name  as optionChoiceName,count(a.option_choices_id) as optionCount FROM evercomm_survey.tbl_answers  as a
//   left join tbl_option_choices oc on a.option_choices_id = oc.option_choice_id where a.keyValue = 4
//   group by oc.option_choice_name`)
// }

const graphReportApi = (userId, startDate, endDate) => {
  let query = util.promisify(mypool.query).bind(mypool);
  // console.log(startDate, endDate, "Ddddddddddddddd")
  return startDate != null || startDate != undefined
    ? query(`select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(a.option_choices_id) as optionCount from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 3
  and a.answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59'
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id;
  select oc.option_choice_id,tb.building_type,oc.option_choice_name,count(a.option_choices_id) option_count from evercomm_survey.tbl_answers as a  
   left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
   left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue =345
   and a.answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59'
   group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id,building_type;   
   SELECT oc.option_choice_name  as optionChoiceName,count(a.option_choices_id) as optionCount,a.option_choices_id FROM evercomm_survey.tbl_answers  as a
  left join tbl_option_choices oc on a.option_choices_id = oc.option_choice_id where a.keyValue = 4
  and a.answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59'
  group by oc.option_choice_name,a.option_choices_id order by a.option_choices_id;
  select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(tb.building_type) as buildingCount from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 6
  and a.answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59'
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by building_type;
  SELECT other,option_choice_name,t1.option_choices_id,count(t1.option_choices_id) as optionCount
  FROM 
      (Select left(a.questions_id, length(a.questions_id)-1) as A1questionId,a.option_choices_id,oc.option_choice_name,a.answered_date from evercomm_survey.tbl_answers as a
       left join evercomm_survey.tbl_option_choices oc on a.option_choices_id = oc.option_choice_id where keyValue = 6 and answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59') t1
  inner JOIN
      (Select left(questions_id, length(questions_id)-1) as A2questionId,SUBSTRING(other,25, 4) as other,answered_date from evercomm_survey.tbl_answers where keyValue = 8 and
      answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59' ) t2
  ON (t1.A1questionId = t2.A2questionId and t1.answered_date = t2.answered_date) 
  group by option_choice_name,other,t1.option_choices_id order by other;
  `)
    : query(`select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(a.option_choices_id) as optionCount from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 3
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id;
  select oc.option_choice_id,tb.building_type,oc.option_choice_name,count(a.option_choices_id) option_count from evercomm_survey.tbl_answers as a  
   left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
   left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue =345
   group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id,building_type;
   select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(tb.building_type) as buildingCount from evercomm_survey.tbl_answers as a  
   inner join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id 
   left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 4 
   group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by building_type;
  select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(tb.building_type) as buildingCount from evercomm_survey.tbl_answers as a  
   left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
   left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 6
   group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by building_type;
   SELECT other,option_choice_name,t1.option_choices_id,count(t1.option_choices_id) as optionCount
  FROM 
      (Select left(a.questions_id, length(a.questions_id)-1) as A1questionId,a.option_choices_id,oc.option_choice_name,a.answered_date from evercomm_survey.tbl_answers as a
       left join evercomm_survey.tbl_option_choices oc on a.option_choices_id = oc.option_choice_id where keyValue = 6) t1
  inner JOIN
      (Select left(questions_id, length(questions_id)-1) as A2questionId,SUBSTRING(other,25, 4) as other,answered_date from evercomm_survey.tbl_answers where keyValue = 8) t2
  ON (t1.A1questionId = t2.A2questionId and t1.answered_date = t2.answered_date) 
  group by option_choice_name,other,t1.option_choices_id order by other;`)
}

const graphReportApiRole = (userId, startDate, endDate) => {
  let query = util.promisify(mypool.query).bind(mypool)
  // console.log(startDate, endDate, "userRole")
  return startDate != null || startDate != undefined
    ? query(`select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(a.option_choices_id) as optionCount,a.users_id from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 3 and a.users_id = ${userId}
  and a.answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59'
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id,a.users_id order by option_choice_id;
  select oc.option_choice_id,tb.building_type,oc.option_choice_name,count(a.option_choices_id) option_count,a.users_id from evercomm_survey.tbl_answers as a  
   left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
   left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue =345 and a.users_id = ${userId}
   and a.answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59'
   group by oc.option_choice_name,tb.building_type,oc.option_choice_id,a.users_id order by option_choice_id,building_type;
   SELECT oc.option_choice_name  as optionChoiceName,count(a.option_choices_id) as optionCount,a.users_id,a.option_choices_id FROM evercomm_survey.tbl_answers  as a
  left join tbl_option_choices oc on a.option_choices_id = oc.option_choice_id where a.keyValue = 4 and a.users_id = ${userId}
  and a.answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59'
  group by oc.option_choice_name,a.users_id,a.option_choices_id order by a.option_choices_id;
  select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(tb.building_type) as buildingCount from evercomm_survey.tbl_answers as a  
   left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
   left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 6 and a.users_id = ${userId}
   and a.answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59'
   group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by building_type;
   SELECT other,option_choice_name,t1.option_choices_id,count(t1.option_choices_id) as optionCount
  FROM 
      (Select left(a.questions_id, length(a.questions_id)-1) as A1questionId,a.option_choices_id,oc.option_choice_name,a.answered_date from evercomm_survey.tbl_answers as a
       left join evercomm_survey.tbl_option_choices oc on a.option_choices_id = oc.option_choice_id where keyValue = 6 and users_id = ${userId} and answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59') t1
  inner JOIN
      (Select left(questions_id, length(questions_id)-1) as A2questionId,SUBSTRING(other,25, 4) as other,answered_date from evercomm_survey.tbl_answers where keyValue = 8 and users_id = ${userId} and
      answered_date between '${startDate} 00:00:00' and '${endDate} 23:59:59' ) t2
  ON (t1.A1questionId = t2.A2questionId and t1.answered_date = t2.answered_date) 
  group by option_choice_name,other,t1.option_choices_id order by other;
  `)
    : query(`select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(a.option_choices_id) as optionCount,a.users_id from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 3 and a.users_id = ${userId}
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id,a.users_id order by option_choice_id;
  select oc.option_choice_id,tb.building_type,oc.option_choice_name,count(a.option_choices_id) option_count,a.users_id from evercomm_survey.tbl_answers as a  
   left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
   left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue =345 and a.users_id = ${userId}
   group by oc.option_choice_name,tb.building_type,oc.option_choice_id,a.users_id order by option_choice_id,building_type;
   SELECT oc.option_choice_name  as optionChoiceName,count(a.option_choices_id) as optionCount,a.users_id,a.option_choices_id FROM evercomm_survey.tbl_answers  as a
  left join tbl_option_choices oc on a.option_choices_id = oc.option_choice_id where a.keyValue = 4 and a.users_id = ${userId}
  group by oc.option_choice_name,a.users_id,a.option_choices_id order by a.option_choices_id;
  select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(tb.building_type) as buildingCount from evercomm_survey.tbl_answers as a  
   left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
   left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 6 and a.users_id = ${userId}
   group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by building_type;
   SELECT other,option_choice_name,t1.option_choices_id,count(t1.option_choices_id) as optionCount
  FROM 
      (Select left(a.questions_id, length(a.questions_id)-1) as A1questionId,a.option_choices_id,oc.option_choice_name,a.answered_date from evercomm_survey.tbl_answers as a
       left join evercomm_survey.tbl_option_choices oc on a.option_choices_id = oc.option_choice_id where keyValue = 6 and users_id = ${userId}) t1
  inner JOIN
      (Select left(questions_id, length(questions_id)-1) as A2questionId,SUBSTRING(other,25, 4) as other,answered_date from evercomm_survey.tbl_answers where keyValue = 8 and
      users_id = ${userId} ) t2
  ON (t1.A1questionId = t2.A2questionId and t1.answered_date = t2.answered_date) 
  group by option_choice_name,other,t1.option_choices_id order by other;
   `)
}

const chiller = () => {
  let query = util.promisify(mypool.query).bind(mypool)
  return query(`select oc.option_choice_id,tb.building_type,oc.option_choice_name,count(a.option_choices_id) option_count from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue =345
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id;`)
}

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
  typeAndArea,
  // typeAndBMS,
  // age,
  graphReportApi,
  graphReportApiRole,
  chiller
};
