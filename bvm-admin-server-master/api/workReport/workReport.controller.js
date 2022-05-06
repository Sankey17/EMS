import { generateControllers } from "../../modules/query";
import { WorkReport } from "./workReport.modal";
import { Users } from '../users/users.model';
import moment from "moment";
import mongoose from 'mongoose';

const getWorkReport = async(req, res) => {
    try {
        const user = await Users.findById(req.userId)
        if (!user) {
            throw new Error('Invalid User !')
        }
        const result = await WorkReport.find(user.role === "user" ? { employeeId: user._id } : {})
        res.status(200).send(result);
    } catch (e) {
        console.log("Error", e);
        res.status(422).send({ error: "Error in getting WorkReport" });
    }
}

const creatWorkReport = async(req, res) => {
    try {
        let { project, task, hours, minutes, status, attendType = "Half day" } = req.body.data;
        const user = await Users.findById(req.userId);
        if (!user) {
            throw new Error('Invalid User !')
        }
        if (hours >= 8) {
            hours = 8;
            minutes = 0;
            attendType = "Full day";
        } else {
            attendType = "Half day";
        }
        const newWorkReport = WorkReport({
            employeeId: user._id,
            employeeCode: user.employeeCode || null,
            employeeName: user.firstName + " " + user.lastName,
            date: moment().format('L'),
            project,
            task,
            hours,
            minutes,
            status
        });
        const result = await newWorkReport.save()
        res.status(200).send(result);
    } catch (e) {
        console.log("Error", e);
        res.status(422).send({ error: "Error in Creating WorkReport" });
    }
};

const getUserReported = async(req, res) => {
    try {
        const user = await Users.findById(req.userId)
        if (!user) {
            throw new Error('Invalid User !')
        }
        const result = await WorkReport.find({ employeeId: user._id, date: moment().format('L') })
        console.log(result)
        res.status(200).send(result);
    } catch (e) {
        console.log("Error", e);
        res.status(422).send({ error: "Error in getting WorkReport" });
    }
};

const getWorkReportFilter = async(req, res) => {
    try {
        const id = req.body.employeeId;
        const date = req.body.date;
        console.log(id, date);
        const r = await WorkReport.find();
        // console.log(r);
        const result = await WorkReport.find(req.body)

        res.status(200).send(result);
    } catch (error) {
        console.log("Error", error);
        res.status(422).send({ error: "Error in getting CheckIn & CheckOut" });
    }
};

const getWorkReportAdmin = async(req, res) => {
    try {
        const user = await Users.findById(req.userId);
        if (!user && user.role !== 'admin') {
            throw new Error('Invalid Request !')
        }

        let users = (req.body.user && req.body.user.length > 0 ? req.body.user.map(mongoose.Types.ObjectId) : await Users.find({}, { '_id': 1 })).map(data => data._id ? data._id : data);

        const month = req.body.month || parseInt(moment().format('M'));
        const year = req.body.year || parseInt(moment().format('YYYY'));
        const result = await Users.aggregate(
            [{
                    $match: {
                        'role': 'user',
                        _id: { $in: users }
                    }
                },
                {
                    $lookup: {
                        from: 'workreports',
                        let: {
                            'id': '$_id'
                        },
                        pipeline: [{
                                $addFields: {
                                    month: { $month: { $toDate: '$date' } },
                                    year: { $year: { $toDate: '$date' } }
                                }
                            },
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$month', month] },
                                            { $eq: ['$year', year] },
                                            { $eq: ['$employeeId', '$$id'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    "_id": 0,
                                    "date": 1,
                                    "attendType": 1
                                }
                            }
                        ],
                        as: 'workreport'
                    }
                },
                {
                    $addFields: {
                        fullName: {
                            $concat: ['$firstName', ' ', '$lastName']
                        }
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'fullName': 1,
                        'workreport': 1
                    }
                }
            ]
        );
        res.status(200).send(result);
    } catch (error) {
        console.log("Error", error);
        res.status(422).send({ error: "Error in getting Workreport" });
    }
};

export default generateControllers(WorkReport, {
    getWorkReport,
    creatWorkReport,
    getUserReported,
    getWorkReportFilter,
    getWorkReportAdmin,
})

// db.users.aggregate()
//     .match({role:'user'})
//     .lookup({
//         from:'workreports',
//         // localField:'_id',
//         // foreignField:'employeeId',
//         let:{id:'$_id'},
//         pipeline:[
//             {$addFields: {
//                     month: {$month: {$toDate: '$date'}},
//                     year: {$year: {$toDate: '$date'}}
//                 }},
//             {$match: {
//                     $expr: {
//                         $and:[
//                             {$eq:['$month',8]},
//                             {$eq:['$year',2021]},
//                             {$eq:['$employeeId','$$id']}
//                         ]
//                     }
//                 }},
//             {
//                 $project: {
//                     "_id":0,
//                     "date":1,
//                     "attendType":1
//                 }
//             }
//         ],
//         as:'workreport'
//     })
//     .project({"_id":1,'workreport':1})