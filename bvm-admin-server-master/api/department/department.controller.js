import {generateControllers} from "../../modules/query";
import {Department} from "./department.model";

const postDepartment = async (req, res) => {
  const data = req.body.department;
  try {
    Department.find({name: data} ,async (err, myData) => {
      if (myData.length > 0) {
        res.status(422).send({error: "department is already exists"});
      } else {
        await Department.create({name: data})
        res.status(200).send("success");
        }
    })
  } catch(err) {
    res.status(422).send({error: "Error in getting department details"});
  }
}

const getDepartment = async (req, res) => {
  try {
    const { page, limit} = req.query
    const pageLimit = parseInt(limit) || 5
    const skip = parseInt(page)*pageLimit || 0
    console.log("skip", skip)
    const department = await Department.find({}).sort({createdAt: -1}).skip(skip).limit(pageLimit)
    const totalDepartment = await Department.find({}).sort({createdAt: -1}).countDocuments()

    if(page !== "") {
      res.status(200).send({ department: department || [], page: parseInt(page || 0), limit: pageLimit, totalDepartment, pages: Math.ceil(totalDepartment/pageLimit) });
    }else {
      Department.find({},(error, mydata) => {
        res.status(200).send(mydata);
      })
    }
  } catch (err) {
    res.status(422).send({ error: "Error in getting department details" });
  }
}

const deleteDepartment = async (req, res) => {
  try {
    await Department.deleteOne({_id : req.params.department_id })
    res.status(200).send("success");
  } catch (err) {
    res.status(422).send({ error: "Error in delete department details" });
  }
}

const updateDepartment = async (req, res) => {
  const data = req.body.data
  try {
    Department.find({name: data} ,async (err, myData) => {
      if (myData.length > 0) {
        res.status(422).send({error: "department is already exists"});
      } else {
        await Department.findOneAndUpdate({
            _id : req.params.department_id },
          {
            $set: {
              name: req.body.data
            }
          })
        res.status(200).send("success");
      }
    })
  } catch (err) {
    res.status(422).send({ error: "Error in delete department details" });
  }
}

export default generateControllers(Department, {
  postDepartment, getDepartment, deleteDepartment, updateDepartment
});
