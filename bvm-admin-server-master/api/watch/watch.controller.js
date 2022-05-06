import moment from "moment"

import {generateControllers} from "../../modules/query";
import {Watch} from "./watch.model";

const getTimeInfo = async (req, res) => {
    try {
        const body = req.query;
        const employeeId = req.user._id;
        const isExists = await Watch.findOne({employeeId, date: body.date});
        res.status(200).send(isExists);
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({error: "Error in getting user time info"});
    }
};

const onlineEmployeeList = async (req, res) => {
    try {
        const data = req.body;
        let result = {};
        const todayDate = moment(new Date()).format("DD/MM/YYYY")
        const timestamp =  moment(todayDate, "DD/MM/YYYY").unix()

        if (data.id) {
            const wt = await Watch.findOne({ _id: data.id });
            let body = {
                breakStart: false,
                lunchStart: false,
                workStart: false
            };
            if(wt.workStart){
                body = {
                    ...body,
                    workTime: wt.workTime
                }
                body.workTime = (body.workTime || 0) + (Date.now() - wt.watchStartTime)
            }
            if(wt.lunchStart){
                body = {
                    ...body,
                    lunchTime: wt.lunchTime
                }
                body.lunchTime = (body.lunchTime || 0) + (Date.now() - wt.watchStartTime)
            }
            if(wt.breakStart){
                body = {
                    ...body,
                    breakTime: wt.breakTime
                }
                body.breakTime = (body.breakTime || 0) + (Date.now() - wt.watchStartTime)
            }
            if(wt.workStart || wt.lunchStart || wt.breakStart){
                body.watchStartTime = Date.now()
            }
            await Watch.findOneAndUpdate({ _id: data.id }, {
                $set: body
            });
            res.status(200).send(result);
        } else {
            result = await Watch.find({
                // date: timestamp,
                $or: [
                  { breakStart: true },
                  { lunchStart: true },
                  { workStart: true }
                ]
            });
            res.status(200).send(result);
        }

    } catch (err) {
        console.log("Error", err);
        res.status(422).send({error: "Error in getting user time info"});
    }
};

const updateUserWatch = async (req, res) => {
    try {
        let payload = req.body;
        const {key, status} = req.query;
        const employeeId = req.user._id;
        let watch = {};
        const isExists = await Watch.findOne({employeeId, date: payload.date});
        const day = moment(new Date()).format("DD");
        payload.day = day

        if(status === "start"){
            payload.watchStartTime = Date.now()
        }else {
            payload.watchStartTime = 0
            if(key === "workStart" && isExists.workStart){
                payload = {
                    ...payload,
                    workTime: (isExists && isExists.workTime) || 0
                }
                payload.workTime = isExists.watchStartTime ? (payload.workTime || 0) + (Date.now() - isExists.watchStartTime) : payload.workTime || 0
                console.log("work time:-", payload.workTime)
            }
            if(key === "lunchStart" && isExists.lunchStart){
                payload = {
                    ...payload,
                    lunchTime: (isExists && isExists.lunchTime) || 0
                }
                payload.lunchTime = isExists.watchStartTime ? (payload.lunchTime || 0) + (Date.now() - isExists.watchStartTime) : payload.lunchTime || 0
            }
            if(key === "breakStart" && isExists.breakStart){
                payload = {
                    ...payload,
                    breakTime: (isExists && isExists.breakTime) || 0
                }
                payload.breakTime = isExists.watchStartTime ? (payload.breakTime || 0) + (Date.now() - isExists.watchStartTime) : payload.breakTime || 0
            }
        }

        if (isExists) {
            await Watch.findOneAndUpdate({employeeId, date: payload.date}, {
                $set: payload
            });
            watch = await Watch.findOne({employeeId, date: payload.date})
        } else {
            const year = moment.unix(payload.date).format("YYYY");
            const month = moment.unix(payload.date).format("MM");

            await Watch.updateMany({
                employeeId,
                date: { $lt: payload.date },
                $or: [
                    { breakStart: true },
                    { lunchStart: true },
                    { workStart: true }
                ]
            }, {
                breakStart: false,
                lunchStart: false,
                workStart: false,
            });
            watch = new Watch({
                ...payload,
                year,
                month,
                day,
                employeeId
            });
            watch = await watch.save()
        }
        res.status(200).send(watch);
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({error: "Error in getting update user watch details"});
    }
};

const getMiliSeconds = (hrs,min,sec) => ((hrs*60*60+min*60+sec)*1000)

const manuallyUpdateWatch = async (req, res) => {
    try {
        let payload = req.body;
        let {lunchTime, workTime, breakTime} = payload
        let {user} = req;
        let watch = {};

        if(user.role !== "admin") {
            return res.status(422).send({ error: "You are not eligible." });
        }

        if(lunchTime && Number(lunchTime)){
            const split = lunchTime.toString().split(".")
            payload.lunchTime = getMiliSeconds(Number(split[0] || 0),Number(split[1] || 0),0);
        }
        if(workTime && Number(workTime)){
            const split = workTime.toString().split(".")
            payload.workTime = getMiliSeconds(Number(split[0] || 0),Number(split[1] || 0),0);
        }
        if(breakTime && Number(breakTime)){
            const split = breakTime.toString().split(".")
            payload.breakTime = getMiliSeconds(Number(split[0] || 0),Number(split[1] || 0),0);
        }
        const isExists = await Watch.findOne({_id: payload._id});

        if (isExists) {
            await Watch.findOneAndUpdate({_id: payload._id}, {
                $set: payload
            });
            watch = await Watch.findOne({ _id: payload._id})
        }
        res.status(200).send(watch);
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({error: "Error in getting update user watch details"});
    }
}

const getAllMovementOfCurrnetYear = async (req, res) => {
    try {
        const body = req.query;
        const year = body.year || moment(new Date()).format("YYYY");
        const employeeId = body.userId || req.user._id;
        const events = await Watch.find({employeeId, year}).sort({date: -1});
        res.status(200).send(events);
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({error: "Error in getting all events."});
    }
};

const getAttendanceHours = async (req, res) => {
    try {
        const data = req.body;
        const events = await Watch.find({employeeCode: data.employeeCode}).sort({date: -1});
        res.status(200).send(events);
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({error: "Error in getting all events."});
    }
};

const getWorkingHours = async (req, res) => {
    try {
        const data = req.body;
        let events = {};
        if (data.id) {
            events = await Watch.findOne({employeeId: data.id, day: data.day, month: 2, year: data.year});
            const wh = events.workTime || 0;
            const lh = events.lunchTime || 0;
            const bh = events.breakTime || 0;
            const workminutes = ("0" + (Math.floor(wh / 60000) % 60)).slice(-2) || 0;
            const workhours = ("0" + Math.floor(wh / 3600000)).slice(-2) || 0;
            const lunchminutes = ("0" + (Math.floor(lh / 60000) % 60)).slice(-2) || 0;
            const lunchhours = ("0" + Math.floor(lh / 3600000)).slice(-2) || 0;
            const breakminutes = ("0" + (Math.floor(bh / 60000) % 60)).slice(-2) || 0;
            const breakhours = ("0" + Math.floor(bh / 3600000)).slice(-2) || 0;
            events = {
                workTime: Number(`${workhours}.${workminutes}` || 0),
                lunchTime: Number(`${lunchhours}.${lunchminutes}` || 0),
                breakTime: Number(`${breakhours}.${breakminutes}` || 0)
            };
            res.status(200).send(events);
        } else {
            events = await Watch.aggregate([
                {$match: {year: data.year, month: data.month}},
                {
                    $group: {
                        _id: "$employeeId",
                        workTime: { $sum: "$workTime" },
                        employeeName: { "$first": "$employeeName"}
                    }
                }
            ]);
            res.status(200).send(events);
        }

    } catch (err) {
        console.log("Error", err);
        res.status(422).send({error: "Error in getting all events."});
    }
};

export const putWorkingHours = async () => {
    try {
        const todayDate = moment(new Date()).format("DD/MM/YYYY")
        const timestamp =  moment(todayDate, "DD/MM/YYYY").unix()
        const currentHours =  moment(new Date()).hours()
        const day = moment(new Date()).format("DD");
        console.log(currentHours)
        const todayWatch = await Watch.aggregate([{
            $match: {
                $and: [
                    { date: timestamp },
                    {
                        $or: [
                            { breakStart: true },
                            { lunchStart: true },
                            { workStart: true }
                        ]
                    }
                ]
            }
        }]);

        if(currentHours <= 20) {
            if(todayWatch && todayWatch.length){
                for (const i in todayWatch) {
                    const wt = todayWatch[i]
                    let body = {
                        day
                    }
                    if(wt.workStart){
                        body = {
                            ...body,
                            workTime: wt.workTime
                        }
                        body.workTime = (body.workTime || 0) + (Date.now() - wt.watchStartTime)
                        console.log(`Work Time ${wt.employeeName}`, body.workTime)
                    }
                    if(wt.lunchStart){
                        body = {
                            ...body,
                            lunchTime: wt.lunchTime
                        }
                        body.lunchTime = (body.lunchTime || 0) + (Date.now() - wt.watchStartTime)
                        console.log(`Lunch Time ${wt.employeeName}`, body.lunchTime)
                    }
                    if(wt.breakStart){
                        body = {
                            ...body,
                            breakTime: wt.breakTime
                        }
                        body.breakTime = (body.breakTime || 0) + (Date.now() - wt.watchStartTime)
                        console.log(`Break Time ${wt.employeeName}`, body.breakTime)
                    }
                    if(wt.workStart || wt.lunchStart || wt.breakStart){
                        body.watchStartTime = Date.now()
                    }
                    await Watch.findOneAndUpdate({employeeId: wt.employeeId, date: timestamp}, {
                        $set: body
                    });
                }
            }
        }else {
            console.log("INVALID Working Hours", timestamp)
            if(todayWatch && todayWatch.length) {
                for (const i in todayWatch) {
                    const wt = todayWatch[i]
                    await Watch.findOneAndUpdate({employeeId: wt.employeeId, date: timestamp}, {
                        $set: {
                            breakStart: false,
                            lunchStart: false,
                            workStart: false,
                        }
                    });
                }
            }
        }
        console.log("Put Working Hours", currentHours)
        // console.log(JSON.stringify(todayWatch))
    } catch (err) {
        console.log("Error", err)
    }
};

export default generateControllers(Watch, {
    getTimeInfo,
    onlineEmployeeList,
    updateUserWatch,
    getWorkingHours,
    getAllMovementOfCurrnetYear,
    getAttendanceHours,
    manuallyUpdateWatch
});
