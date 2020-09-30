const { questionService } = require("../service");
const response = require("../model/response");
const { format } = require("util");


const createQuestion = (req, res) => {
    const data = req.body.question
    return questionService.createQuestion({ data }).then(dataResult => {
        return res.json(
            response({
                success: true,
                message: "Inserted!",
                payload: dataResult
            })
        )
    }).catch(err => {
        res.json(response({ success: false, message: err }));
    });
}


module.exports = { createQuestion }
