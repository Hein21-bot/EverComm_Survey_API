const { formService } = require('../service')
const response = require('../model/response')
var groupArray = require('group-array');

const getFormInfo = (req, res) => {
    let companyId = req.params.companyId;
    
    formService.getFormInfo(companyId).then(data => {
        let temp = Object.keys(groupArray(data, 'company_id')).map((v, k) => {
            return groupArray(data, 'company_id')[v];
        }).map((v1,k1)=> {
            return {"company_id": v1[0].company_id,"company_name": v1[0].company_name,
             "buildings": v1.map((v2,k2)=>{
                 return {"building_id": v2.building_id, "building_name": v2.building_name, 
                "address": v2.address}
             })}
        })

        res.json(response({ success: true, payload: temp }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

module.exports = { getFormInfo }