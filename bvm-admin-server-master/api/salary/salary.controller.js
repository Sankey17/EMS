import {generateControllers} from "../../modules/query";
import {Salary} from "./salary.model";

const findDetails = async (req, res) => {
    try {
        const data = req.body
        const find = await Salary.find({employeeId: data.employeeId})
        res.status(200).send({done: true, data: find})
    } catch (err) {
        console.log(err)
        res.status(422).send({done: false, message: err.message, error: "Error in create category!"})
    }
}

const checkDetails = async (req, res) => {
    let result = {}
    try {
        const data = req.body
        result = await Salary.find({'employeeId': {"$in": data.employeeId}}).countDocuments() > 0
        if (result) {
            result = await Salary.findOne({employeeId: data.employeeId, "year": {$gte: data.yearValue}}).countDocuments() > 0
            if (result) {
                result = await Salary.findOne({employeeId: data.employeeId, "year": {$eq: data.yearValue}}).countDocuments() > 0
                if(!result){
                    return res.status(200).send({done: true, data: true})
                }else{
                    result = await Salary.findOne({employeeId: data.employeeId, "month": {$gte: data.month}}).countDocuments() > 0
                    return res.status(200).send({done: true, data: result})
                }
            }
        }else{
            res.status(200).send({done: true, data: result})
        }
    } catch (err) {
        console.log(err)
        res.status(422).send({done: false, message: err.message, error: "Error in create category!"})
    }
}


const filterData = async (req, res) => {
    try {
        let query = {};
        if (req.body) {
            query = req.body;
        }
        const data = await Salary.find(query);
        res.status(200).send(data);
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({ error: "Error in getting Users details" });
    }
};


export default generateControllers(Salary, {
    checkDetails, findDetails, filterData
});
