import moment from "moment";

import {generateControllers} from "../../modules/query";
import {Reports} from "./reports.model";
import {Users} from "../users";

const getReportsByPage = async (req, res) => {
  try {
    const { page, limit, userId} = req.query
    const employeeId = userId || req.user._id
    const pageLimit = parseInt(limit) || 5
    const skip = parseInt(page)*pageLimit || 0

    let query = {}
    if(req.user && req.user.role !== "admin"){
      query = {
        employeeId
      }
    }

    const reports = await Reports.find(query).sort({date: -1}).skip(skip).limit(pageLimit)
    const totalReports = await Reports.find(query).sort({date: -1}).countDocuments()

    let employees = []
    if(req.user && req.user.role === "admin"){
      const empIds = reports.map(emp => emp.employeeId)
      employees = await Users.find({ _id: { $in: empIds } } ).select("firstName lastName designation employeeCode")
    }
    res.status(200).send({ reports: reports || [], page: parseInt(page), limit: pageLimit, totalReports, pages: Math.ceil(totalReports/pageLimit), employees });
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting reports" });
  }
};

const postEmployeeReport = async (req, res) => {
  try {
    const body = req.body
    const employeeId = req.user._id

    const year =  moment.unix(body.date).format("YYYY");
    const month =  moment.unix(body.date).format("MM");
    const day =  moment.unix(body.date).format("DD");

    const isExists = await Reports.findOne({ employeeId, year, month, day })

    if(isExists) {
      return res.status(422).send({ error: "Report already submitted." });
    }

    let report = new Reports({
      ...body,
      year,
      month,
      day,
      employeeId
    })
    await report.save()
    res.status(200).send(report);
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in submitting report" });
  }
};

export default generateControllers(Reports, {
  getReportsByPage,
  postEmployeeReport
});