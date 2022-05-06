import {generateControllers} from "../../modules/query";
import {attendance} from "./attendance.model";
import moment from 'moment'
import {Watch} from "../watch";
import {Users} from "../users";

const getEmployee = async (req, res) => {
  try {
    const _id = req.params.id;
    const tenant = await attendance.find({ employeeId: _id });
    res.status(200).send(tenant);
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting attendance details" });
  }
};

const checkAttendance = async (req, res) => {
  try {
    const data = req.body;
    const employeeCode = data.employeeCode;
    const date = data.tDate;
    await attendance.find({ $and: [ { employeeCode :employeeCode }, { date: date} ] }, function(err, response) {
      if (err) res.send(err);
      res.json(
          response
      );
    });
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting user details" });
  }
};


const postAttendance = async (req, res) => {
  try {
    const data = req.body;
    const date = data.date;
    const tDate = moment(new Date()).format('DD/MM/YYYY');
    if(tDate === date) {
     await  attendance.create(
          {
            employeeCode: data.employeeCode,
            name: data.name,
            date: data.date,
            present: data.present,
          })
    }
    res.send("done");
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting user details" });
  }
};

const getAttendanceChart = async (req, res) => {
  try {
    const { year, month } = req.query;
    let attendances = await Watch.aggregate([
      { $match:{ year: parseInt(year) ,month: parseInt(month) }},
      {
        $project: {
          employeeName:"$employeeName",
          employeeId: "$employeeId",
          month: "$month",
          year: "$year",
          day: "$day",
          workTime: "$workTime",
          lunchTime: "$lunchTime",
          breakTime: "$breakTime"
        }
      }
    ])
    attendances = attendances.map(attend => {
      const wh = attend.workTime || 0;
      const lh = attend.lunchTime || 0;
      const bh = attend.breakTime || 0;
      const workminutes = ("0" + (Math.floor(wh / 60000) % 60)).slice(-2) || 0;
      const workhours = ("0" + Math.floor(wh / 3600000)).slice(-2) || 0;
      const lunchminutes = ("0" + (Math.floor(lh / 60000) % 60)).slice(-2) || 0;
      const lunchhours = ("0" + Math.floor(lh / 3600000)).slice(-2) || 0;
      const breakminutes = ("0" + (Math.floor(bh / 60000) % 60)).slice(-2) || 0;
      const breakhours = ("0" + Math.floor(bh / 3600000)).slice(-2) || 0;

      attend.workTime = Number(`${workhours}.${workminutes}` || 0);
      attend.lunchTime = Number(`${lunchhours}.${lunchminutes}` || 0);
      attend.breakTime = Number(`${breakhours}.${breakminutes}` || 0);
      return attend
    })
    const employees = await Users.find({ role: "user", status: "active" }).select("firstName lastName designation photo")
    res.status(200).send({ attendances, employees });
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({ error: "Error in getting all events." });
  }
};

export default generateControllers(attendance, {
  getEmployee,postAttendance,checkAttendance,
  getAttendanceChart
});
