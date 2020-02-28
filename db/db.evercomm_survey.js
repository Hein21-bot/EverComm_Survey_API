const mysql = require("mysql")
const util = require("util")
const moment = require("moment")


require('dotenv').config()

const mypool = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const login = (username, password) => {
    query = util.promisify(mypool.query).bind(mypool)
    return query(`SELECT tbl_user.userId,tbl_user.username,tbl_employee.employeeName,tbl_user.employeeId,tbl_employee.employeeImage,tbl_employee.designation 
    FROM tbl_user LEFT JOIN tbl_employee ON tbl_user.employeeId = tbl_employee.employeeId WHERE BINARY tbl_user.username = '${username}' AND tbl_user.password = '${password}' AND tbl_user.active = true`)
}

//user
const getAdmin = () => {
    query = util.promisify(mypool.query).bind(mypool)
    return query(`SELECT * FROM tbl_admins`)
}

const getQuestion = (admin_id, survey_header_id) => {
    query = util.promisify(mypool.query).bind(mypool)
    return query(`select * from tbl_questions as q inner join tbl_option_choices as o  on q.question_id = o.questions_id
    left join tbl_survey_sections as s on s.survey_section_id = q.survey_sections_id left join tbl_survey_headers as h on h.survey_header_id = s.survey_headers_id
    left join tbl_admins as a on a.admin_id = h.admin_id where a.admin_id = ${admin_id} and h.survey_header_id = ${survey_header_id}
    and a.active = true and h.active = true;`)
}

const isExistAdmin = (username, userId) => {
    query = util.promisify(mypool.query).bind(mypool)
    return query(`SELECT * FROM tbl_user WHERE username='${username}' && userId <> ${userId}`)
}

const addAdmin = (username, password, active, employeeId) => { 
    query = util.promisify(mypool.query).bind(mypool)
    return query(`INSERT INTO tbl_user (username,password,active,employeeId) VALUES (?,?,?,?)`, [username, password, active, employeeId])
}

const updateAdmin = (userId, username, password, active, employeeId) => {
    query = util.promisify(mypool.query).bind(mypool)
    return query(`UPDATE tbl_user SET username = '${username}', password = '${password}', active = ${active},employeeId = ${employeeId} WHERE userId=${userId}`)
}

const getAdminById = (userId) => {
    query = util.promisify(mypool.query).bind(mypool)
    return query(`SELECT * FROM tbl_user WHERE userId = ${userId}`)
}

//Report

const getOpening = (startDate,accountLedgerId) => {
    query = util.promisify(mypool.query).bind(mypool);
    return query(`SELECT Sum(debit)-Sum(credit) As opening FROM tbl_accounttransactions where accountId = ${accountLedgerId} AND invoiceDate < '${startDate}'`)
}

const getGeneralLedger = (startDate,endDate,accountLedgerId)=>{
    query = util.promisify(mypool.query).bind(mypool);
    return query(`CALL get_GeneralLedger('${startDate}','${endDate}',${accountLedgerId})`);
}

module.exports = {
    getQuestion,login,isExistAdmin,addAdmin,updateAdmin,getAdmin,getAdminById,getOpening,getGeneralLedger
}


