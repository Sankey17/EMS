import moment from "moment";
const jwt = require('jsonwebtoken')

import { generateControllers } from "../../modules/query";
import { Users } from "../users";
import { Holidays } from "./holidays.model";

const getHolidays = async(req, res) => {
    try {
        const { page, limit } = req.query
        const pageLimit = parseInt(limit) || 5
        const skip = parseInt(page) * pageLimit || 0

        const holidays = await Holidays.find({}).sort({ createdAt: -1 }).skip(skip).limit(pageLimit)
        const totalHolidays = await Holidays.find({}).sort({ createdAt: -1 }).countDocuments()

        res.status(200).send({ holidays: holidays || [], page: parseInt(page || 0), limit: pageLimit, totalHolidays, pages: Math.ceil(totalHolidays / pageLimit) });
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({ error: "Error in getting reports" });
    }
};
const getHolidaysMonth = async(req, res) => {
    try {
        const data = req.body
        const lastDate = moment(new Date(data.year, data.month, 0)).format("DD");
        const last = data.month + "-" + lastDate + "-" + data.year
        const first = data.month + "-" + "01" + "-" + data.year
        const lastDateTimeStamp = moment(last, "MM-DD-YYYY").unix();
        const firstDateTimeStamp = moment(first, "MM-DD-YYYY").unix();
        const holidays = await Holidays.find({ date: { $gt: firstDateTimeStamp, $lt: lastDateTimeStamp } }).countDocuments()
        res.status(200).send({ holidays });
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({ error: "Error in getting reports" });
    }
};

const createAndPutHolidays = async(req, res) => {
    try {
        const body = req.body
            // const { user } = req

        const token = req.headers.authorization;
        if (!token) return res.status(403).send({ success: false, message: "No token provided." });
        const userId = jwt.decode(token).id;
        const user = await Users.findOne({ _id: userId });


        console.log({ user });

        const day = moment.unix(body.date).format('dddd')

        const isExists = await Holidays.findOne({ date: body.date })

        if (isExists || user.role !== "admin") {
            return res.status(422).send({ error: user.role !== "admin" ? "You are not eligible." : "Holiday already exists." });
        }

        let holiday = new Holidays({
            ...body,
            day
        })
        await holiday.save()
        res.status(200).send(holiday);
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({ error: "Error in submitting holiday" });
    }
};

const removeHoliday = async(req, res) => {
    try {
        const { id } = req.query
        const { user } = req

        if (user.role !== "admin") {
            return res.status(422).send({ error: "You are not eligible." });
        }
        await Holidays.remove({ _id: id })
        res.status(200).send({ message: "Holiday removed successfully" });
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({ error: "Error in removing holiday" });
    }
};

export default generateControllers(Holidays, {
    getHolidays,
    createAndPutHolidays,
    getHolidaysMonth,
    removeHoliday
});