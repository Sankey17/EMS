import {generateControllers} from "../../modules/query";
import {Users} from "../users/users.model";
import bcrypt from "bcrypt-nodejs";
import ObjectID from "bson-objectid";

const getEmployee = async (req, res) => {
  try {
    const data = req.body
    let query = {};
    if(data._id){
      query = await Users.aggregate([
        {
          $match: {_id:ObjectID(data._id)}
        },
        {
          $project: {role:0,password:0,onboardingStatus:0,status:0,updatedAt:0,createdAt:0}
        }
      ]);
    }else{
      query = await Users.aggregate([
        {
          $match: data
        },
        {
          $project: {role:0,password:0,onboardingStatus:0,status:0,updatedAt:0,createdAt:0}
        }
      ]);
    }
    res.status(200).send(query);
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting Users details" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    req.body.updatedAt = new Date();
    const result = await Users.update({ _id: id }, { $set: req.body });
    if (result) {
      const Users = await Users.find({ _id: id });
      res.status(200).send(Users);
    }
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting Users details" });
  }
};

const LeaveUpdate = async (req, res) => {
  try {
   const data = req.body
    const response = await Users.update({"leave._id":data.leaveId},
        {$set:{"leave.$.leaveStatus":data.leaveStatus,"leave.$.updatedBy": data.name}})
    res.status(200).send(response);
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting Users details" });
  }
};

const InactiveStatus = async (req, res) => {
  try {
    await Users.findByIdAndUpdate(
      { _id: req.body.id },
      { $set: { status: req.body.status } },
      function(err, result) {
        if (err) {
          console.log(err);
        }
        res.send("Done");
      }
    );
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting Users details" });
  }
};

const findEmployeeByEmail = async (req, res) => {
    try {
      const data = req.body
      const create = await Users.find({_id:data.id})
      res.status(200).send({done: true, data: create })
    } catch (err) {
      console.log(err)
      res.status(422).send({done: false, message: err.message, error: "Error in create category!"})
    }
};

const updateDetails = async (req, res) => {
  try {
    const data = req.body;
    if(data.id){
      await Users.update({ _id: data.id }, { $set: data })
      return res.status(201).send({success: true, message: "User detail updated successfully."});
    }else{
      let { emailId  } = req.body;
      emailId = emailId && emailId.toLowerCase();
      const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegexp.test(emailId)) {
        return res.status(422).send({ success: false, message: "Invalid Email" });
      }
      const isEmailExist = await Users.findOne({
        emailId: req.body.emailId
      }).then(data => {
        return data ? true : false;
      });
      if (isEmailExist) {
        return res.status(422).send({ success: false, message: "Email is alrady exist" });
      }
      data.password = bcrypt.hashSync("bvm@123");
      data.onboardingStatus = "active"
      data.status = "active"
      data.role = "user"
      await Users.create(data)
      return res.status(201).send({success: true, message: "User created successfully."});
    }
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting Users details" });
  }
};

const leaveForm = async (req, res) => {
  try {
    await Users.update(
      { _id: req.body.id },
      {
        $addToSet: {
          leave: {
            leaveReason: req.body.reason,
            leaveDate: req.body.date,
            leaveDateFrom: req.body.date1,
            updatedBy: "no one",
            leaveStatus: "pending"
          }
        }
      }
    );
    return res.status(201).send({success: true, message: "Submitted successfully."});
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting Users details" });
  }
};

export default generateControllers(Users, {
  getEmployee,
  leaveForm,
  updateEmployee,
  LeaveUpdate,
  InactiveStatus,
  findEmployeeByEmail,
  updateDetails
});
