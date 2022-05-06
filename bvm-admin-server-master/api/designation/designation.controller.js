import {generateControllers} from "../../modules/query";
import {Designation} from "./designation.model";

const postDesignation = async (req, res) => {
  const departmentId = req.body.department;
  const designationData = req.body.designation;
  try {
    Designation.find({designationName: designationData, departmentId: departmentId} ,async (err, myData) => {
      if (myData.length > 0) {
        res.status(422).send({error: "designation already exists"});
      } else {
        await Designation.create({designationName: designationData, departmentId: departmentId});
        res.status(200).send("success");
      }
    })
  } catch(err) {
    res.status(422).send({error: "Error in getting designation details"});
  }
}

const getDesignation = async (req, res) => {
  try {
    const { page, limit} = req.query
    const pageLimit = parseInt(limit) || 5
    const skip = parseInt(page)*pageLimit || 0

    const designation = await Designation.aggregate([
      {
        $lookup: {
          from: "departments",
          localField: "departmentId",
          foreignField: "_id",
          as: "departmentId"
        }
      }
    ]).skip(skip).limit(pageLimit)
    const totalDesignation = await Designation.find({}).sort({createdAt: -1}).countDocuments()
    if(page !== "") {
      res.status(200).send({ designation: designation || [], page: parseInt(page || 0), limit: pageLimit, totalDesignation, pages: Math.ceil(totalDesignation/pageLimit) });
    }else {
      Designation.find({},(error, mydata) => {
        res.status(200).send(mydata);
      })
    }
  } catch (err) {
    res.status(422).send({ error: "Error in getting designation details" });
  }
};

const deleteDesignation = async (req, res) => {
  try {
    await Designation.deleteOne({_id : req.params.designation_id });
    await Designation.deleteMany({departmentId : req.params.designation_id });
    res.status(200).send("success");
  } catch (err) {
    res.status(422).send({ error: "Error in delete designation details" });
  }
}

const updateDesignation = async (req, res) => {
  const departmentId = req.body.department
  const designation = req.body.designation
  try {
    Designation.find({designationName: designation, departmentId: departmentId} ,async (err, myData) => {
      if (myData.length > 0) {
        res.status(422).send({error: "designation already exists"});
      } else {
        await Designation.findOneAndUpdate({
            _id : req.params.designation_id},
          {
            $set:
              {
                departmentId: departmentId,
                designationName: designation
              }
          })
        res.status(200).send("success");
      }
    })
  } catch (err) {
    res.status(422).send({ error: "Error in delete designation details" });
  }
}

export default generateControllers(Designation, {
  postDesignation, getDesignation, deleteDesignation, updateDesignation
});
