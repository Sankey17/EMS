import { generateControllers } from "../../modules/query";
import { BankInformation } from "../bankinformation/bankinformation.model";
import mongoose from "mongoose";

const getBankInformation = async (req, res) => {
  try {
    if (req.params) {
       let query = {};
       query.employeeId = mongoose.Types.ObjectId(req.params.employeeId);
       const data = await BankInformation.find(query);
       res.status(200).send(data);
    }
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting Users details" });
  }
};

const updateBankInfo = async (req, res) => {
  try {
    const body = req.body;
    delete req.body.updatedAt;
    delete req.body.createdAt;
    const _id = req.body._id;
    let bankInfo;
    const isExists = await BankInformation.findOne({ _id });
    if(isExists){
      bankInfo = await BankInformation.findOneAndUpdate({ _id }, {
        $set: body
      });
    }
    else{
        bankInfo = await BankInformation.create(body)
    }


    res.status(200).send({success:true, bankInfo});
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ success:false, error: "Error in updating bank details" });
  }
};

export default generateControllers(BankInformation, {
  getBankInformation,
  updateBankInfo,
});
