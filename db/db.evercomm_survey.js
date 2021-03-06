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
  let query = util.promisify(mypool.query).bind(mypool);

  return query(`CALL userLogin(?);`, [email]);
};

// addUser

const addUser = (userName, password, email, active, created_date, user_level, companyName, phone_number) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`INSERT INTO tbl_login_users(user_name,password,email,active,created_date,user_level_id,company_name,phone_number) VALUES('${userName}', '${password}', '${email}', ${active},'${created_date}', ${user_level}, 
  '${companyName}', ${phone_number});`);
};

const updateUser = (userId, userName, email, active, user_level, companyName, phone_number) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`UPDATE tbl_login_users SET user_name = '${userName}',  email = '${email}' , 
  active = ${active} , user_level_id = ${user_level} , company_name = '${companyName}' , phone_number = '${phone_number}'
  WHERE login_user_id = ${userId};`);
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
  return query(
    `Select Count(*) as DE from tbl_login_users where email ='${email}' and login_user_id != ${user_id} ; `
  );
};

//Question

const getQuestion = (user_id, survey_header_id, buildingId, buildingTypeId, surveySectionId, countryId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return survey_header_id == 1
    ? query(
      `select h.survey_header_id,h.survey_name,s.survey_section_id,s.section_name,q.question_id,q.question_name,q.input_types_id,q.option_groups_id,q.question_key,
    o.option_choice_id,o.option_choice_name from tbl_questions as q left join tbl_option_choices as o  on q.question_id = o.questions_id
        left join tbl_survey_sections as s on s.survey_section_id = q.survey_sections_id left join tbl_survey_headers as h
          on h.survey_header_id = s.survey_headers_id where h.survey_header_id = ${survey_header_id}  and device_type in (${buildingTypeId},0) order by survey_section_id,option_choice_id;

              select other,option_choices_id as optionChoiceId,users_id as userId,questions_id as questionId, survey_headers_id,building_id,keyValue,country_id as countryId,survey_section_id as surveySectionId,
              sub_question_id as subQuestionId from tbl_answers where users_id = ${user_id} and survey_headers_id = ${survey_header_id} and building_id = ${buildingId};
            select chiller,condenser,evaporator,cooling_tower from tbl_buildings where building_id=${buildingId};
            select BMSInstalled from tbl_buildings where building_id=${buildingId};`
    )
    : query(`
  select distinct o.option_choice_id as oc,t1.survey_header_id,t1.survey_name,t1.survey_section_id,t1.section_name,t1.question_id as primary_question,t1.question_name,t1.input_types_id,t1.option_groups_id,t1.question_key,
  t1.option_choice_id as choices_id,t1.option_choice_name as choices,t1.categories as categories,sq.question_id,sq.sub_question_name,sq.question_id as sub_question_id,sq.input_type_id,o.option_choice_name,sq.sub_question_id,o.categories as cat from
  (select h.survey_header_id,h.survey_name,s.survey_section_id,s.section_name,q.question_id,q.question_name,q.input_types_id,q.option_groups_id,q.question_key,
  o.option_choice_id,o.option_choice_name, o.categories from tbl_questions as q 
  left join tbl_option_choices as o  on q.question_id = o.questions_id  
    left join tbl_survey_sections as s on s.survey_section_id = q.survey_sections_id 
    left join tbl_survey_headers as h on h.survey_header_id = s.survey_headers_id 
    where h.survey_header_id = ${survey_header_id} and q.survey_sections_id = ${surveySectionId} order by survey_section_id,option_choice_id) as t1
    left join tbl_sub_questions sq on sq.question_id = t1.question_id
    left join tbl_option_choices o on  sq.sub_question_id = o.sub_question_id ;
    
    
    
    select other,option_choices_id as optionChoiceId,users_id as userId,questions_id as questionId,
 survey_headers_id,building_id,keyValue,country_id as countryId,
 sub_question_id as subQuestionId ,survey_section_id as surveySectionId
 from tbl_answers where users_id = ${user_id} and survey_headers_id = ${survey_header_id} and survey_section_id = ${surveySectionId} and country_id = ${countryId};
          select chiller,condenser,evaporator,cooling_tower from tbl_buildings where building_id=${buildingId};
          select BMSInstalled from tbl_buildings where building_id=${buildingId};`);
};

// answers

const addAnswer = (other, optionChoiceId, userId, questionId, survey_headers_id, building_id, keyValue, totalQuestionCount, answeredDate, buildingType, countryId, subQuestionId, surveySectionId) => {
  let query = util.promisify(mypool.query).bind(mypool);

  return survey_headers_id === 1
    ? query(
      `INSERT INTO tbl_answers(other, option_choices_id, users_id, questions_id,survey_headers_id,building_id,answered_date,keyValue,country_id,sub_question_id,survey_section_id) VALUES 
    ('${other}', ${optionChoiceId}, ${userId}, '${questionId}', ${survey_headers_id}, ${building_id}, '${answeredDate}',${keyValue},${countryId},${subQuestionId},${surveySectionId});
    UPDATE tbl_buildings SET total_questions = ${totalQuestionCount},building_type = '${buildingType}' WHERE building_id = ${building_id};`
    )
    : query(
      `INSERT INTO tbl_answers (other, option_choices_id, users_id, questions_id,survey_headers_id,building_id,answered_date,keyValue,country_id,sub_question_id,survey_section_id)  VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
      [
        other,
        optionChoiceId,
        userId,
        questionId,
        survey_headers_id,
        building_id,
        answeredDate,
        keyValue,
        countryId,
        subQuestionId,
        surveySectionId,
      ]
    );
};


const deleteAnswer = (userId, survey_headers_id, building_id, countryId, surveySectionId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  let sql =
    building_id !== null
      ? 'DELETE FROM tbl_answers WHERE users_id = "' +
      userId +
      '"  AND survey_headers_id= "' +
      survey_headers_id +
      '" AND building_id="' +
      building_id +
      '"'
      : `DELETE FROM evercomm_survey.tbl_answers WHERE users_id = ${parseInt(
        userId
      )} and survey_section_id = ${parseInt(
        surveySectionId
      )} and country_id = ${parseInt(countryId)}`;
  return query(sql);
};

// questions



const deleteQuestion = (question_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    'DELETE FROM tbl_questions WHERE question_id = "' + question_id + '"'
  );
};

const updateQuestion = (question_id, questionName, required, isOther, optionGroupId, untiId, surveySectionId, inputTypeId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`UPDATE tbl_questions SET question_name = '${questionName}', required = ${required}, is_other = ${isOther} , 
  option_groups_id = ${optionGroupId} , units_id = ${untiId} , survey_sections_id = ${surveySectionId} , input_types_id = ${inputTypeId} 
  WHERE question_id = ${question_id} `);
};

// @HeinMinHtet
// AnswerCount

const reportTotalAnswers = (userId, surveyHeaderId, countryId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`Call reportTotalAnswer(${surveyHeaderId})`);
};

const reportDistributorAnswers = (userId, surveyHeaderId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`Call reportDistributorAnswers(${surveyHeaderId},${userId})`);
};

const reportUserAnswer = (userId, surveyHeaderId, countryId, buildingId, buildingTypeId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return surveyHeaderId == 1
    ? query(`select h.survey_header_id,h.survey_name,s.survey_section_id,s.section_name,q.question_id,q.question_name,q.input_types_id,q.option_groups_id,q.question_key,
    o.option_choice_id,o.option_choice_name from tbl_questions as q left join tbl_option_choices as o  on q.question_id = o.questions_id
        left join tbl_survey_sections as s on s.survey_section_id = q.survey_sections_id left join tbl_survey_headers as h
          on h.survey_header_id = s.survey_headers_id where h.survey_header_id = ${surveyHeaderId}  and device_type in (${buildingTypeId},0) order by survey_section_id,option_choice_id;

              select other,option_choices_id as optionChoiceId,users_id as userId,questions_id as questionId, survey_headers_id,building_id,keyValue,country_id as countryId,survey_section_id as surveySectionId,
              sub_question_id as subQuestionId from tbl_answers where users_id = ${userId} and survey_headers_id = ${surveyHeaderId} and building_id = ${buildingId};
            select chiller,condenser,evaporator,cooling_tower from tbl_buildings where building_id=${buildingId};
            select BMSInstalled from tbl_buildings where building_id=${buildingId};`)
    : query(`select distinct o.option_choice_id as oc,t1.survey_header_id,t1.survey_name,t1.survey_section_id,t1.section_name,t1.question_id as primary_question,t1.question_name,t1.input_types_id,t1.option_groups_id,t1.question_key,
   t1.option_choice_id as choices_id,t1.option_choice_name as choices,t1.categories as categories,sq.question_id,sq.sub_question_name,sq.question_id as sub_question_id,sq.input_type_id,o.option_choice_name,sq.sub_question_id,o.categories as cat from
   (select h.survey_header_id,h.survey_name,s.survey_section_id,s.section_name,q.question_id,q.question_name,q.input_types_id,q.option_groups_id,q.question_key,
   o.option_choice_id,o.option_choice_name, o.categories from tbl_questions as q 
   left join tbl_option_choices as o  on q.question_id = o.questions_id  
     left join tbl_survey_sections as s on s.survey_section_id = q.survey_sections_id 
     left join tbl_survey_headers as h on h.survey_header_id = s.survey_headers_id 
     where h.survey_header_id = ${surveyHeaderId}  order by survey_section_id,option_choice_id) as t1
     left join tbl_sub_questions sq on sq.question_id = t1.question_id
     left join tbl_option_choices o on  sq.sub_question_id = o.sub_question_id ;     
     
     
     select other,option_choices_id as optionChoiceId,users_id as userId,questions_id as questionId,
  survey_headers_id,building_id,keyValue,country_id as countryId,
  sub_question_id as subQuestionId ,survey_section_id as surveySectionId
  from tbl_answers where users_id = ${userId} and survey_headers_id = ${surveyHeaderId} and country_id = ${countryId};
  
SELECT survey_title as surveyTitle from tbl_survey_title as st where st.survey_header_id=${surveyHeaderId};`);
};

const userLevelAnswer = (userId, surveyHeaderId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL userLevelAnswers(?)`, [userId]);
};

const surveyList = (userId, survey_header_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`CALL surveyList(?,?)`, [userId, survey_header_id]);
};

const sectionList = (surveyHeaderId, countryId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`select section_name,survey_headers_id,organization,user_id,ans_count,question_count,survey_sections_id from(SELECT * FROM evercomm_survey.tbl_survey_sections as tss
    left join tbl_country as tc on tc.survey_header_id = tss.survey_headers_id where survey_headers_id = ${surveyHeaderId}
    and country_id = ${countryId}) as t1
  left join
  (SELECT count(distinct survey_section_id) as ans_count,country_id ,survey_section_id
  FROM evercomm_survey.tbl_answers where survey_headers_id = ${surveyHeaderId}  and country_id = ${countryId}
  group by country_id,survey_section_id) as t2 on t1.survey_section_id = t2.survey_section_id
  left join (SELECT count(survey_sections_id) as question_count,survey_sections_id FROM evercomm_survey.tbl_questions where survey_headers_id = ${surveyHeaderId} group by survey_sections_id)
  as t3 on t1.survey_section_id = t3.survey_sections_id;
  SELECT survey_title FROM evercomm_survey.tbl_survey_title;
  `);
};

// @hmh
// buildings

const addBuilding = (buildingName, companyName, buildingType, buildingTypeId, created_date, address, postalCode, country, comment, userId, surveyHeadersId, chiller, condenser, evaporator, coolingTower, BMSInstalled) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `INSERT INTO tbl_buildings (building_name, company_name,building_type,building_type_id, remark, active,created_date, address, postal_code,country,comment,
      user_id,survey_headers_id,chiller,condenser,evaporator,cooling_tower,BMSInstalled)  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)	
    `,
    [
      buildingName,
      companyName,
      buildingType,
      buildingTypeId,
      "ok",
      1,
      created_date,
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
      BMSInstalled,
    ]
  );
};

const getBuildingType = () => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`select * from evercomm_survey.tbl_building_type`);
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

const dateTimeMenuApi = (userId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`Call reportMenuUser(${userId})`);
};

const dateTimeMenuAdminApi = (userId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`Call reportMenuAdmin()`);
};

const dateTimeMenuDistributorApi = (userId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`Call reportMenuDistributor(${userId})`);
};

const typeAndArea = (startDate, endDate) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return startDate != null
    ? query(`select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(a.option_choices_id) as optionCount from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 3
  and a.answered_date between '${startDate}' and '${endDate}'
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id`)
    : query(`select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(a.option_choices_id) as optionCount from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 3
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id`);
};

const graphReportApi = (userId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(a.option_choices_id) as optionCount from evercomm_survey.tbl_answers as a  
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
  group by option_choice_name,other,t1.option_choices_id order by other;`);
};

const graphReportApiRole = (userId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(a.option_choices_id) as optionCount,a.users_id from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 3 and a.users_id = ${userId}
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id,a.users_id order by option_choice_id;
  select oc.option_choice_id,tb.building_type,oc.option_choice_name,count(a.option_choices_id) option_count,a.users_id from evercomm_survey.tbl_answers as a  
   left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
   left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue =345 and a.users_id = ${userId}
   group by oc.option_choice_name,tb.building_type,oc.option_choice_id,a.users_id order by option_choice_id,building_type;
   select oc.option_choice_id,oc.option_choice_name,tb.building_type,count(tb.building_type) as buildingCount from evercomm_survey.tbl_answers as a  
   inner join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id 
   left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue = 4 and a.users_id = ${userId}   
   group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by building_type;
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
   `);
};

const chiller = () => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`select oc.option_choice_id,tb.building_type,oc.option_choice_name,count(a.option_choices_id) option_count from evercomm_survey.tbl_answers as a  
  left join evercomm_survey.tbl_option_choices as oc on a.option_choices_id = oc.option_choice_id
  left join evercomm_survey.tbl_buildings as tb on a.building_id = tb.building_id where a.keyValue =345
  group by oc.option_choice_name,tb.building_type,oc.option_choice_id order by option_choice_id;`);
};

const createQuestion = ({ questionName, isOther, required, optionGroupId, unitsId, surveySectionId, inputTypeId, surveyHeaderId, buildingType }) => {

  let query = util.promisify(mypool.query).bind(mypool);
  return buildingType == null ?
    query(`INSERT INTO tbl_questions(question_name, is_other,required, option_groups_id, units_id,survey_sections_id,input_types_id,survey_headers_id) VALUES 
  ('${questionName}',${isOther}, ${required}, ${optionGroupId}, ${unitsId}, ${surveySectionId}, ${inputTypeId}, ${surveyHeaderId})`)
    :
    query(`INSERT INTO tbl_questions(question_name, is_other,required, option_groups_id, units_id,survey_sections_id,input_types_id,survey_headers_id,device_type) VALUES 
  ('${questionName}',${isOther}, ${required}, ${optionGroupId}, ${unitsId}, ${surveySectionId}, ${inputTypeId}, ${surveyHeaderId},${buildingType});`)
};

const createOptionChoice = ({ optionChoiceName, questionId }) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`INSERT INTO tbl_option_choices(option_choice_name,questions_id) VALUES 
  ('${optionChoiceName}',${questionId});`);
};

const getUser = (user_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`SELECT login_user_id,user_name,email,active,name as role,company_name,phone_number,survey_header_id,created_date FROM evercomm_survey.tbl_login_users as tlu
  inner join evercomm_survey.tbl_user_level tul on tul.user_level_id = tlu.user_level_id
  left join evercomm_survey.tbl_user_survey as tbs on tbs.user_id = tlu.login_user_id order by created_date desc;
  SELECT * FROM evercomm_survey.tbl_survey_headers as ts 
left join evercomm_survey.tbl_user_survey tus on ts.survey_header_id =tus.survey_header_id where user_id = ${user_id} and active = 1;`);
};

const userSurveyPermession = ({ user_id, surveyHeaderId }) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `INSERT INTO tbl_user_survey(user_id,survey_header_id) VALUES  (${user_id},${surveyHeaderId});`
  );
};

const removePermsession = (user_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `Delete from evercomm_survey.tbl_user_survey where user_id = ${user_id}`
  );
};

const getOneUserInfo = (user_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `Select login_user_id,user_name,email,active,user_level_id,company_name,phone_number from tbl_login_users where login_user_id = ${user_id}`
  );
};

const getAdmin = (user_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `SELECT * FROM evercomm_survey.tbl_login_users where user_level_id in (1,3) and login_user_id = ${user_id};`
  );
};

const userEdit = (user_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `SELECT * FROM evercomm_survey.tbl_login_users where login_user_id = ${user_id};`
  );
};

const userPasswordEdit = (user_id, editPassword) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `UPDATE tbl_login_users SET password = '${editPassword}' WHERE login_user_id = ${user_id};`
  );
};

const surveyHeader = (surveyName, remark, active, user_id, created_date, modified_date) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`INSERT INTO evercomm_survey.tbl_survey_headers (survey_name,remark,active,login_users_id,created_date,modified_date)
  VALUES ('${surveyName}','ok',1,${user_id},'${created_date}','${modified_date}');`);
};

const surveySection = ({ sectionName, pageNo, active, surveyHeaderId, createdDate, }) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`INSERT INTO evercomm_survey.tbl_survey_sections (section_name,page_no,active,survey_headers_id,created_date)
  VALUES ('${sectionName}',${pageNo},${active},${surveyHeaderId},'${createdDate}')`);
};

const surveyHeaderEdit = (surveyHeaderId, survey_name, remark, active, user_id) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `UPDATE evercomm_survey.tbl_survey_headers SET survey_name = '${survey_name}' , remark = '${remark}' ,active = ${active} , login_users_id=${user_id} WHERE survey_header_id = ${surveyHeaderId};`
  );
};

const surveySectionRemove = (surveyHeaderId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `Delete from evercomm_survey.tbl_survey_sections where survey_headers_id = ${surveyHeaderId}`
  );
};

const getAdminId = () => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `select login_user_id from tbl_login_users where user_level_id = 1`
  );
};

const removeSurveyHeader = (surveyHeaderId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `UPDATE tbl_survey_headers SET active = 0 WHERE survey_header_id=${surveyHeaderId};`
  );
};

const addCountry = (country, organization, surveyHeaderId, userId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`INSERT INTO evercomm_survey.tbl_country (country,organization,survey_header_id,user_id)
  VALUES ('${country}','${organization}',${surveyHeaderId},${userId})`);
};

const getCountry = (surveyHeaderId, userId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`SELECT * FROM evercomm_survey.tbl_country where survey_header_id = ${surveyHeaderId} and user_id=${userId};
  SELECT count(survey_headers_id) as surveyList FROM evercomm_survey.tbl_survey_sections where survey_headers_id = ${surveyHeaderId} and survey_section_id != 9;
  `);
};

const getCountrySurvey = (surveyHeaderId) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(`SELECT * FROM evercomm_survey.tbl_country as tc 
  inner join tbl_survey_sections as tss on tc.survey_header_id = tss.survey_headers_id where tc.survey_header_id = ${surveyHeaderId}; `);
};

const checkDuplicateCountry = (country, organization) => {
  let query = util.promisify(mypool.query).bind(mypool);
  return query(
    `SELECT * FROM evercomm_survey.tbl_country where country = '${country}' and organization = '${organization}'; `
  );
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
  deleteQuestion,
  updateQuestion,
  reportTotalAnswers,
  getMenu,
  updateUser,
  getMenuLevl,
  surveyMenuApiLevel,
  surveyList,
  addBuilding,
  getBuildingType,
  surveyMenuApi,
  userLevelAnswer,
  reportUserAnswer,
  dateTimeMenuApi,
  dateTimeMenuAdminApi,
  typeAndArea,
  graphReportApi,
  graphReportApiRole,
  chiller,
  createQuestion,
  createOptionChoice,
  getUser,
  userSurveyPermession,
  removePermsession,
  getOneUserInfo,
  getAdmin,
  userEdit,
  userPasswordEdit,
  surveyHeader,
  surveySection,
  surveyHeaderEdit,
  surveySectionRemove,
  getAdminId,
  removeSurveyHeader,
  addCountry,
  getCountry,
  getCountrySurvey,
  checkDuplicateCountry,
  sectionList,
};
