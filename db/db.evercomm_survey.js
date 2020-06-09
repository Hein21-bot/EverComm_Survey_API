const mysql = require("mysql")
const util = require("util")

require('dotenv').config()


const mypool = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true
});

// login

const login = (email) => {

  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT * FROM tbl_login_users WHERE email = '${email}';`)
}

// addUser


const addUser = (userName, password, email, companyName) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_login_users(user_name,password,email,active,user_level_id,company_name) VALUES(?,?,?,?,?,?)`,
    [userName, password, email, 1, 2, companyName])

}

const updateUser = (userId, userName, password, email) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_login_users SET user_name = '${userName}', password = '${password}', email = '${email}' WHERE 
  login_user_id = ${userId} `)

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

const getMenuLevl = (userId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`select t1.survey_header_id, survey_header_name, count(qcount) as questions, count(acount) as answers
  from (
    SELECT
      distinct q.question_id as qcount, a.questions_id as acount, q.survey_headers_id as survey_header_id,h.survey_name as survey_header_name
    FROM
      tbl_questions as q
    left join tbl_answers a on q.survey_headers_id=a.survey_headers_id and q.question_id=a.questions_id 
		left join tbl_user_survey us on us.survey_header_id = q.survey_headers_id and us.user_id = ${userId}
		left join tbl_survey_headers h on h.survey_header_id = us.survey_header_id
      
    group by q.question_id
  ) as t1 where survey_header_name !=""
  group by survey_header_id;`)
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




//Question

const getQuestion = (user_id, survey_header_id, buildingId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`select * from tbl_questions as q left join tbl_option_choices as o  on q.question_id = o.questions_id
      left join tbl_survey_sections as s on s.survey_section_id = q.survey_sections_id left join tbl_survey_headers as h
        on h.survey_header_id = s.survey_headers_id where h.survey_header_id = ${survey_header_id} and h.active = true;
          select other,option_choices_id as optionChoiceId,users_id as userId,questions_id as questionId, survey_headers_id,building_id from  
            tbl_answers where users_id = ${user_id} and survey_headers_id = ${survey_header_id} and building_id = ${buildingId};`)
}


// answers

const addAnswer = (other, optionChoiceId, userId, questionId, survey_headers_id, building_id, device_type) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_answers(other, option_choices_id, users_id, questions_id,survey_headers_id,building_id,device_type) VALUES (?,?,?,?,?,?,?)`,
    [other, optionChoiceId, userId, questionId, survey_headers_id, building_id, device_type])
}

const deleteAnswer = (userId, survey_headers_id, building_id, device_type) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('DELETE FROM tbl_answers WHERE users_id = "' + userId + '"  AND survey_headers_id= "' + survey_headers_id + '" AND building_id="' + building_id + '" AND device_type = "' + device_type + '"')
}


const updateAnswer = (answer_id, other, optionChoiceId, userId, questionId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_answers SET other = '${other}', option_choices_id = ${optionChoiceId}, users_id = ${userId} , 
  questions_id = ${questionId} WHERE answer_id = ${answer_id} `)
}


// questions

const addQuestion = (questionName, required, isOther, optionGroupId, untiId, surveySectionId, inputTypeId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_questions(question_name, required, is_other, option_groups_id, units_id, survey_sections_id, input_types_id) 
  VALUES(?,?,?,?,?,?,?)`,
    [questionName, required, isOther, optionGroupId, untiId, surveySectionId, inputTypeId])
}


const deleteQuestion = (question_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query('DELETE FROM tbl_questions WHERE question_id = "' + question_id + '"')
}

const updateQuestion = (question_id, questionName, required, isOther, optionGroupId, untiId, surveySectionId, inputTypeId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`UPDATE tbl_questions SET question_name = '${questionName}', required = ${required}, is_other = ${isOther} , 
  option_groups_id = ${optionGroupId} , units_id = ${untiId} , survey_sections_id = ${surveySectionId} , input_types_id = ${inputTypeId} 
  WHERE question_id = ${question_id} `)
}

// @HeinMinHtet
// AnswerCount

const reportTotalAnswers = (userId, surveyHeaderId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool)
  return (startDate != null) ? query(`select  distinct(acount) as acount,t4.other ,t4.option_choice_name, t4.question_name,t4.question_id,
  sh.survey_name,ss.section_name,sh.survey_header_id,ss.survey_section_id,i.input_type_id,(select count(option_choices_id) as atcount 
  from tbl_answers as aa where date(answered_date)  >= '${startDate}' and date(answered_date) <= '${endDate}' and 
  survey_headers_id=${surveyHeaderId} and 
      aa.questions_id=t4.question_id group by questions_id order by atcount DESC)as atcount
        from(select  acount ,option_choice_name, question_name,question_id,other,survey_sections_id,survey_headers_id,input_types_id from
  (
      (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
      q.survey_headers_id from
        (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers WHERE 
          date(answered_date)  >=' ${startDate}' and date(answered_date) <= '${endDate}' 
            GROUP BY option_choices_id,questions_id,other) as t1 
              right join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t1.option_choices_id
              left join evercomm_survey.tbl_questions q on oc.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) union
      (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
      q.survey_headers_id from
        (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers WHERE 
          date(answered_date)  >= '${startDate}' and date(answered_date) <= '${endDate}' and other like '{"YearOfManufacturing%' 
            GROUP BY option_choices_id,questions_id,other) as t2
              left join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t2.option_choices_id
              left join evercomm_survey.tbl_questions q on t2.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) )as t3 
              order by question_id) as t4
                left join evercomm_survey.tbl_input_types i on t4.input_types_id = input_type_id
                left join evercomm_survey.tbl_survey_headers sh on sh.survey_header_id = t4.survey_headers_id        
                  left join evercomm_survey.tbl_survey_sections ss on ss.survey_section_id = t4.survey_sections_id where 
                    survey_header_id = ${surveyHeaderId} and survey_header_id!="" order by question_id;
    select survey_headers_id,count(distinct building_id) as Number_of_buildings from evercomm_survey.tbl_answers where 
    survey_headers_id=${surveyHeaderId};`)
    : query(`select  distinct(acount) as acount,t4.other ,t4.option_choice_name, t4.question_name,t4.question_id,sh.survey_name,
    ss.section_name,sh.survey_header_id,
    ss.survey_section_id,i.input_type_id,(select count(option_choices_id) as atcount 
    from tbl_answers as aa where survey_headers_id=${surveyHeaderId} and 
          aa.questions_id=t4.question_id group by questions_id order by atcount DESC)as atcount
            from(select  acount ,option_choice_name, question_name,question_id,other,survey_sections_id,survey_headers_id,input_types_id from
      (
          (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
          q.survey_headers_id from
            (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers 
                GROUP BY option_choices_id,questions_id,other) as t1 
                  right join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t1.option_choices_id
                  left join evercomm_survey.tbl_questions q on oc.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) 
                  union
          (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
          q.survey_headers_id from
            (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers WHERE 
        other like '{"YearOfManufacturing%' 
                GROUP BY option_choices_id,questions_id,other) as t2
                  left join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t2.option_choices_id
                  left join evercomm_survey.tbl_questions q on t2.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) )
                  as t3 
                  order by question_id) as t4
                    left join evercomm_survey.tbl_input_types i on t4.input_types_id = input_type_id
                    left join evercomm_survey.tbl_survey_headers sh on sh.survey_header_id = t4.survey_headers_id        
                      left join evercomm_survey.tbl_survey_sections ss on ss.survey_section_id = t4.survey_sections_id where 
                        survey_header_id = ${surveyHeaderId} and survey_header_id!="" order by question_id;
      select survey_headers_id,count(distinct building_id) as Number_of_buildings from evercomm_survey.tbl_answers where 
      survey_headers_id=${surveyHeaderId};`)
}

const reportDistributorAnswers = (userId, surveyHeaderId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool)
  return (startDate != null) ? query(`select  distinct(acount) as acount,t4.other ,t4.option_choice_name, t4.question_name,t4.question_id,
  sh.survey_name,ss.section_name,sh.survey_header_id,
  ss.survey_section_id,i.input_type_id,(select count(option_choices_id) as atcount 
  from tbl_answers as aa where survey_headers_id=${surveyHeaderId} and date(answered_date)  >= '${startDate}' and 
  date(answered_date) <= '${endDate}' and
        aa.questions_id=t4.question_id group by questions_id order by atcount DESC)as atcount
          from(select  acount ,option_choice_name, question_name,question_id,other,survey_sections_id,survey_headers_id,input_types_id from
    (
        (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
        q.survey_headers_id from
          (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers where
          date(answered_date)  >= '${startDate}' and date(answered_date) <= '${endDate}'
              GROUP BY option_choices_id,questions_id,other) as t1 
                right join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t1.option_choices_id
                left join evercomm_survey.tbl_questions q on oc.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) 
                union
        (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
        q.survey_headers_id from
          (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers WHERE 
          date(answered_date)  >= '${startDate}' and date(answered_date) <= '${endDate}' and
      other like '{"YearOfManufacturing%' 
              GROUP BY option_choices_id,questions_id,other) as t2
                left join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t2.option_choices_id
                left join evercomm_survey.tbl_questions q on t2.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) )
                as t3 
                order by question_id) as t4
                right join tbl_user_survey us on t4.survey_headers_id = us.survey_header_id
                  left join evercomm_survey.tbl_input_types i on t4.input_types_id = input_type_id
                  left join evercomm_survey.tbl_survey_headers sh on sh.survey_header_id = t4.survey_headers_id        
                    left join evercomm_survey.tbl_survey_sections ss on ss.survey_section_id = t4.survey_sections_id 
                   where question_id != "" and us.user_id = ${userId};
    select survey_headers_id,count(distinct building_id) as Number_of_buildings from evercomm_survey.tbl_answers where 
    survey_headers_id=${surveyHeaderId};`)
    : query(`select  distinct(acount) as acount,t4.other ,t4.option_choice_name, t4.question_name,t4.question_id,sh.survey_name,
    ss.section_name,sh.survey_header_id,
    ss.survey_section_id,i.input_type_id,(select count(option_choices_id) as atcount 
    from tbl_answers as aa where survey_headers_id=${surveyHeaderId} and 
          aa.questions_id=t4.question_id group by questions_id order by atcount DESC)as atcount
            from(select  acount ,option_choice_name, question_name,question_id,other,survey_sections_id,survey_headers_id,input_types_id from
      (
          (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
          q.survey_headers_id from
            (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers 
                GROUP BY option_choices_id,questions_id,other) as t1 
                  right join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t1.option_choices_id
                  left join evercomm_survey.tbl_questions q on oc.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) 
                  union
          (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
          q.survey_headers_id from
            (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers WHERE 
        other like '{"YearOfManufacturing%' 
                GROUP BY option_choices_id,questions_id,other) as t2
                  left join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t2.option_choices_id
                  left join evercomm_survey.tbl_questions q on t2.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) )
                  as t3 
                  order by question_id) as t4
                  right join tbl_user_survey us on t4.survey_headers_id = us.survey_header_id
                    left join evercomm_survey.tbl_input_types i on t4.input_types_id = input_type_id
                    left join evercomm_survey.tbl_survey_headers sh on sh.survey_header_id = t4.survey_headers_id        
                      left join evercomm_survey.tbl_survey_sections ss on ss.survey_section_id = t4.survey_sections_id 
                     where question_id != "" and us.user_id = ${userId};
                     select survey_headers_id,count(distinct building_id) as Number_of_buildings from evercomm_survey.tbl_answers where 
      survey_headers_id=${surveyHeaderId};`)
}



const reportUserAnswer = (userId, surveyHeaderId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool)
  return (startDate != null) ? query(`select  distinct(acount) as acount,t4.other ,t4.option_choice_name, t4.question_name,t4.question_id,
  sh.survey_name,ss.section_name,
  sh.survey_header_id,ss.survey_section_id,i.input_type_id,
  (select count(option_choices_id) as atcount from tbl_answers as aa where date(answered_date)  >= '${startDate}' and 
  date(answered_date) <= '${endDate}' 
  and survey_headers_id=${surveyHeaderId} and users_id = ${userId} and
        aa.questions_id=t4.question_id group by questions_id order by atcount DESC)as atcount
          from(select  acount ,option_choice_name, question_name,question_id,other,survey_sections_id,survey_headers_id,input_types_id from
    (
        (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
        q.survey_headers_id from
          (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers WHERE 
          users_id = ${userId} and
            date(answered_date)  >='${startDate}' and date(answered_date) <= '${endDate}'
              GROUP BY option_choices_id,questions_id,other) as t1 
                right join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t1.option_choices_id
                left join evercomm_survey.tbl_questions q on oc.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) union
        (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
        q.survey_headers_id from
          (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers WHERE 
          users_id = ${userId} and
            date(answered_date)  >= '${startDate}' and date(answered_date) <= '${endDate}' and other like '{"YearOfManufacturing%' 
              GROUP BY option_choices_id,questions_id,other) as t2
                left join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t2.option_choices_id
                left join evercomm_survey.tbl_questions q on t2.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) )as t3 
                order by question_id) as t4
                  left join evercomm_survey.tbl_input_types i on t4.input_types_id = input_type_id
                  left join evercomm_survey.tbl_survey_headers sh on sh.survey_header_id = t4.survey_headers_id        
                    left join evercomm_survey.tbl_survey_sections ss on ss.survey_section_id = t4.survey_sections_id where 
                      survey_header_id = ${surveyHeaderId} and survey_header_id!="" order by question_id;
                      select survey_headers_id,count(distinct building_id) as Number_of_buildings from evercomm_survey.tbl_answers where 
                      survey_headers_id=${surveyHeaderId} and users_id = ${userId};`) :
    query(`select  distinct(acount) as acount,t4.other ,t4.option_choice_name, t4.question_name,t4.question_id,sh.survey_name,ss.section_name,
    sh.survey_header_id,
    ss.survey_section_id,i.input_type_id,(select count(option_choices_id) as atcount 
    from tbl_answers as aa where survey_headers_id=${surveyHeaderId} and users_id = ${userId} and
          aa.questions_id=t4.question_id group by questions_id order by atcount DESC)as atcount
            from(select  acount ,option_choice_name, question_name,question_id,other,survey_sections_id,survey_headers_id,input_types_id from
      (
          (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
          q.survey_headers_id from
            (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers where 
            users_id = ${userId}
                GROUP BY option_choices_id,questions_id,other) as t1 
                  right join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t1.option_choices_id
                  left join evercomm_survey.tbl_questions q on oc.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) union
          (select distinct(acount)as acount ,oc.option_choice_name, q.question_name,q.question_id,other,q.survey_sections_id,q.input_types_id,
          q.survey_headers_id from
            (SELECT count(option_choices_id)as acount,option_choices_id,questions_id,other FROM evercomm_survey.tbl_answers WHERE 
            users_id = ${userId} and
        other like '{"YearOfManufacturing%' 
                GROUP BY option_choices_id,questions_id,other) as t2
                  left join evercomm_survey.tbl_option_choices oc on oc.option_choice_id = t2.option_choices_id
                  left join evercomm_survey.tbl_questions q on t2.questions_id = q.question_id where survey_headers_id=${surveyHeaderId}) )as t3 
                  order by question_id) as t4
                    left join evercomm_survey.tbl_input_types i on t4.input_types_id = input_type_id
                    left join evercomm_survey.tbl_survey_headers sh on sh.survey_header_id = t4.survey_headers_id        
                      left join evercomm_survey.tbl_survey_sections ss on ss.survey_section_id = t4.survey_sections_id where 
                        survey_header_id = ${surveyHeaderId} and survey_header_id!="" order by question_id;
                        select survey_headers_id,count(distinct building_id) as Number_of_buildings from evercomm_survey.tbl_answers where 
                        survey_headers_id=${surveyHeaderId} and users_id = ${userId};`)
}

const userLevelAnswer = (userId, surveyHeaderId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT user_level_id FROM evercomm_survey.tbl_login_users where login_user_id = ${userId};`)
}


const surveyList = (userId, survey_header_id) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`select survey_header_id, t2.building_id as building_id, b.building_name as building_name, answers, (select count(*) from      
  tbl_questions qq where qq.survey_headers_id=t2.survey_header_id and qq.input_types_id != 8
    ) as questions
        from (
    select survey_header_id, building_id, count(qcount) as questions, count(acount) as answers
        from (
    SELECT
        distinct  q.question_id as qcount, a.questions_id as acount, q.survey_headers_id as survey_header_id,h.survey_name as 
        survey_header_name,a.building_id as building_id
    FROM
        tbl_questions as q
          left join tbl_answers a on q.survey_headers_id=a.survey_headers_id and q.question_id=a.questions_id and a.users_id = ${userId}
            left join tbl_survey_headers h on h.survey_header_id = q.survey_headers_id   
              left join tbl_buildings b on a.building_id = b.building_id
            where q.survey_headers_id= ${survey_header_id} and a.building_id!=""  and b.active = 1
              ) as t1 
      group by survey_header_id, building_id
        ) as t2
          left join tbl_buildings b on b.building_id=t2.building_id;
        SELECT distinct tbl_buildings.user_id,tbl_buildings.survey_headers_id,
          tbl_buildings.building_id,tbl_buildings.building_name FROM
            evercomm_survey.tbl_buildings inner join evercomm_survey.tbl_answers on
              tbl_buildings.user_id = ${userId} and tbl_buildings.survey_headers_id=${survey_header_id}`)
}



// @hmh
// buildings

const addBuilding = (buildingName, companyName, address, postalCode, country, comment, userId, surveyHeadersId) => {
  const query = util.promisify(mypool.query).bind(mypool)
  return query(`INSERT INTO tbl_buildings(building_name, company_name, remark, active, created_by, address, postal_code,country,
    comment,user_id,survey_headers_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    [buildingName, companyName, 'ok', 1, 1, address, postalCode, country, comment, userId, surveyHeadersId])
}


// surveyMenuApi

const surveyMenuApi = (userId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey,section_name,survey_section_id,created_date
  FROM (
    select 
      distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name ,
      ss.section_name as section_name,ss.survey_section_id as survey_section_id,sh.created_date as created_date
        from tbl_survey_headers as sh 
          left join tbl_answers a on sh.survey_header_id=a.survey_headers_id and a.users_id = ${userId}
          left join tbl_survey_sections ss on sh.survey_header_id = ss.survey_headers_id
            ) as t1 group by survey_header_id,section_name,survey_section_id;`)
}

const surveyMenuApiLevel = (userId) => {
  query = util.promisify(mypool.query).bind(mypool)
  return query(`SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey,section_name,survey_section_id,created_date
  FROM (
    select 
      distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name ,
      ss.section_name as section_name,ss.survey_section_id as survey_section_id,sh.created_date as created_date
        from tbl_survey_headers as sh 
          left join tbl_answers a on sh.survey_header_id=a.survey_headers_id and a.users_id = ${userId}
          left join tbl_survey_sections ss on sh.survey_header_id = ss.survey_headers_id
          right join tbl_user_survey us on us.survey_header_id = sh.survey_header_id and us.user_id = ${userId}
            ) as t1 where t1.survey_name != "" group by survey_header_id,section_name,survey_section_id;`)
}

const dateTimeMenuApi = (userId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool)
  // console.log("startDate is ==>", startDate)
  const overAllQuery = `SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey,section_name,
  survey_section_id, building_name,buildings_id,created_date 
     FROM (
      select 
        distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name ,b.building_name,
          b.building_id as buildings_id,ss.section_name as section_name,ss.survey_section_id as survey_section_id,a.users_id,
          sh.created_date as created_date from tbl_survey_headers as sh 
            left join tbl_answers a on sh.survey_header_id=a.survey_headers_id and  
                date(a.answered_date) >= '${startDate}' and date(a.answered_date) <= '${endDate}'
            left join tbl_survey_sections ss on sh.survey_header_id = ss.survey_headers_id
            left join tbl_buildings b on b.building_id = a.building_id
            left join tbl_user_survey us on us.survey_header_id = sh.survey_header_id 
              ) as t1 where t1.survey_name != "" and t1.users_id = ${userId}
                group by survey_header_id,section_name,survey_section_id,building_name,buildings_id,created_date
                  order by  survey_section_id`
  return (startDate != null) ? query(overAllQuery) : (endDate != null) ? query(overAllQuery) :
    query(`SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey,section_name,survey_section_id,
    building_name,buildings_id,created_date
     FROM ( 
       select distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name ,b.building_name,
           b.building_id as buildings_id,ss.section_name as section_name,ss.survey_section_id as survey_section_id,a.users_id,
           sh.created_date as created_date from tbl_survey_headers as sh 
              left join tbl_answers a on sh.survey_header_id=a.survey_headers_id 
              left join tbl_survey_sections ss on sh.survey_header_id = ss.survey_headers_id
              left join tbl_buildings b on b.building_id = a.building_id 
              left join tbl_user_survey us on us.survey_header_id = sh.survey_header_id 
              ) as t1 where t1.survey_name != ""  and t1.users_id = ${userId}
                  group by survey_header_id,section_name,survey_section_id,building_name,buildings_id,created_date
                   `)
}

const dateTimeMenuAdminApi = (userId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool)
  // console.log("startDate is ==>", startDate)
  const overAllQuery = `SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey,section_name,
  survey_section_id, building_name,buildings_id,created_date 
     FROM (
      select 
        distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name ,b.building_name,
          b.building_id as buildings_id,ss.section_name as section_name,ss.survey_section_id as survey_section_id,
          sh.created_date as created_date from tbl_survey_headers as sh 
            left join tbl_answers a on sh.survey_header_id=a.survey_headers_id and 
                date(a.answered_date) >= '${startDate}' and date(a.answered_date) <= '${endDate}'
            left join tbl_survey_sections ss on sh.survey_header_id = ss.survey_headers_id
            left join tbl_buildings b on b.building_id = a.building_id) as t1 
                group by survey_header_id,section_name,survey_section_id,building_name,buildings_id,created_date
                  order by  survey_section_id`
  return (startDate != null) ? query(overAllQuery) : (endDate != null) ? query(overAllQuery) :
    query(`SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey,section_name,survey_section_id,
      building_name,buildings_id,created_date
       FROM (    
         select distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name ,b.building_name,
             b.building_id as buildings_id,ss.section_name as section_name,ss.survey_section_id as survey_section_id,
             sh.created_date as created_date from tbl_survey_headers as sh 
                left join tbl_answers a on sh.survey_header_id=a.survey_headers_id 
                left join tbl_survey_sections ss on sh.survey_header_id = ss.survey_headers_id
                left join tbl_buildings b on b.building_id = a.building_id) as t1 
                    group by survey_header_id,section_name,survey_section_id,building_name,buildings_id,created_date
                      order by  survey_section_id`)
}

const dateTimeMenuDistributorApi = (userId, startDate, endDate) => {
  query = util.promisify(mypool.query).bind(mypool)

  const overAllQuery = `SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey,section_name,survey_section_id,
  building_name,buildings_id,created_date
   FROM (    
     select distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name ,b.building_name,
         b.building_id as buildings_id,ss.section_name as section_name,ss.survey_section_id as survey_section_id,a.users_id,
         sh.created_date as created_date from tbl_survey_headers as sh 
            left join tbl_answers a on sh.survey_header_id=a.survey_headers_id and 
            date(a.answered_date) >= '${startDate}' and date(a.answered_date) <= '${endDate}'
            left join tbl_survey_sections ss on sh.survey_header_id = ss.survey_headers_id
            left join tbl_buildings b on b.building_id = a.building_id 
            right join tbl_user_survey us on us.survey_header_id = sh.survey_header_id and us.user_id = ${userId}
            ) as t1 where t1.survey_name != "" 
                group by survey_header_id,section_name,survey_section_id,building_name,buildings_id,created_date
                  order by  survey_section_id`
  return (startDate != null) ? query(overAllQuery) : (endDate != null) ? query(overAllQuery) :
    query(`SELECT survey_header_id,survey_name,count(building_id) as amount_of_survey,section_name,survey_section_id,
    building_name,buildings_id,created_date
     FROM (    
       select distinct a.building_id as building_id,sh.survey_header_id as survey_header_id, sh.survey_name as survey_name ,b.building_name,
           b.building_id as buildings_id,ss.section_name as section_name,ss.survey_section_id as survey_section_id,a.users_id,
           sh.created_date as created_date from tbl_survey_headers as sh 
              left join tbl_answers a on sh.survey_header_id=a.survey_headers_id 
              left join tbl_survey_sections ss on sh.survey_header_id = ss.survey_headers_id
              left join tbl_buildings b on b.building_id = a.building_id 
              right join tbl_user_survey us on us.survey_header_id = sh.survey_header_id and us.user_id = ${userId}
              ) as t1 where t1.survey_name != "" 
                  group by survey_header_id,section_name,survey_section_id,building_name,buildings_id,created_date
                    order by  survey_section_id`)
}



module.exports = {
  getQuestion, login, addUser, checkDuplicateEmailInsert,
  checkDuplicateEmailUpdate, dateTimeMenuDistributorApi,
  reportDistributorAnswers,
  addAnswer, deleteAnswer, updateAnswer,
  addQuestion, deleteQuestion, updateQuestion, reportTotalAnswers,
  getMenu, updateUser, getMenuLevl, surveyMenuApiLevel,
  surveyList, addBuilding,
  surveyMenuApi, userLevelAnswer, reportUserAnswer, dateTimeMenuApi, dateTimeMenuAdminApi
}

