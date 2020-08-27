const { surveydb } = require('../db')


const surveyHeader = (surveyName, remark, active, user_id, created_date) => {
    return surveydb.getAdmin(user_id).then(data => {
        if (data.length > 0) {
            return surveydb.surveyHeader(surveyName, remark, active, user_id, created_date)
        }
        else {
            return []
        }

    }).catch(error => {
        throw error
    })
}

const surveySection = async ({ sectionData, surveyHeaderId }) => {
    const resultArr = []
    try {
        for (let i = 0; i < sectionData.length; i++) {
            const d = sectionData[i]
            const pageNo = i + 1
            const active = d.active
            const sectionName = d.sectionName

            const saveResult = await surveydb.surveySection({ pageNo, active, surveyHeaderId, sectionName })
            resultArr.push(saveResult)
        }
        return resultArr

    }
    catch (error) {
        throw error
    }

}

const surveyHeaderEdit = (surveyHeaderId, surveyName, remark, active, user_id) => {
    return surveydb.getAdmin(user_id).then(data => {
        if (data.length > 0) {
            return surveydb.surveyHeaderEdit(surveyHeaderId, surveyName, remark, active, user_id)
        }
        else {
            return []
        }

    }).catch(error => {
        throw error
    })
}

const surveySectionRemove = (user_id) => {
    return surveydb.surveySectionRemove(user_id)
}

const getAdminId = () => {
    return surveydb.getAdminId()
}

const userSurveyPermession = async ({ data, surveyHeaderId }) => {

    const resultArr = []
    try {
        for (let i = 0; i < data.length; i++) {
            const user_id = data[i].login_user_id
            const saveResult = await surveydb.userSurveyPermession({ user_id, surveyHeaderId })
            resultArr.push(saveResult)
        }
        return resultArr

    }
    catch (error) {
        throw error
    }

}



module.exports = { surveyHeader, surveySection, surveyHeaderEdit, surveySectionRemove, getAdminId, userSurveyPermession }