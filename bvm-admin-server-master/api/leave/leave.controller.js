import { generateControllers } from "../../modules/query";
import { Leave } from "../leave/leave.model";
import { Users } from "../users";
const jwt = require('jsonwebtoken')

const getLeaveByQuery = async(req, res) => {
    try {
        const { searchString, status } = req.body;
        const { user } = req
        let query = {
            employeeName: {
                $regex: searchString || "",
                $options: "i"
            }
        }
        if (status) {
            query = {
                ...query,
                leaveStatus: status
            }
        }
        if (user && user.role !== "admin") {
            query = {
                ...query,
                employeeId: user._id.toString()
            }
        }
        console.log("in", query)
        const data = await Leave.find(query).sort({ createdAt: 1 });
        res.status(200).send(data);
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({ error: "Error in getting Leave details" });
    }
};

const createAndPutLeave = async(req, res) => {
    try {
        const { _id } = req.body;
        // const { user } = req;

        const token = req.headers.authorization;
        if (!token) return res.status(403).send({ success: false, message: "No token provided." })

        const userId = jwt.decode(token).id

        const user = await Users.findOne({ _id: userId });

        req.body.updatedAt = new Date();
        let leave = {}
            // console.log({ _id, user });
        if (_id) {
            // console.log({ _id, _id })
            await Leave.updateOne({ _id }, { $set: req.body });
            leave = await Leave.find({ _id });
        } else {

            const newLeave = new Leave({
                ...req.body,
                employeeId: user._id,
                designation: user.designation,
                employeeCode: user.employeeCode || user,
                employeeName: `${user.firstName} ${user.lastName}`,
            })
            leave = await newLeave.save()
                // console.log({ leave });
        }
        res.status(200).send(leave);
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({ error: "Error in create and update leave details" });
    }
};

export default generateControllers(Leave, {
    getLeaveByQuery,
    createAndPutLeave
});