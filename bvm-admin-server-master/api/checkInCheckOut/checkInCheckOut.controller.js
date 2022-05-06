import { generateControllers } from "../../modules/query";
import { CheckInCheckOut } from "./checkInCheckOut.model";
import { Users } from '../users/users.model';
import moment from "moment";

const getTimeDiffence = (checkInTime, checkOutTime) => {

    let checkInTimeArray = checkInTime.replace(" ", ":").split(":")
    let checkOutTimeArray = checkOutTime.replace(" ", ":").split(":")

    for (let i = 0; i < 3; i++) {
        checkInTimeArray[i] = parseInt(checkInTimeArray[i])
        checkOutTimeArray[i] = parseInt(checkOutTimeArray[i])
    }

    if (checkInTimeArray[3] === 'PM') { checkInTimeArray[0] += 12 }
    if (checkOutTimeArray[3] === 'PM') { checkOutTimeArray[0] += 12 }

    let hour = checkOutTimeArray[0] - checkInTimeArray[0]
    let minute = checkOutTimeArray[1] - checkInTimeArray[1]
    let second = checkOutTimeArray[2] - checkInTimeArray[2]

    if (second < 0) {
        second += 60
        minute--
    }
    if (minute < 0) {
        minute += 60
        hour--
    }
    let returnString = ''

    returnString = hour > 0 ? returnString + hour + " Hour " : returnString
    returnString = minute > 0 ? returnString + minute + " Minute " : returnString
    returnString = second > 0 ? returnString + second + " Second" : returnString
    return (returnString)
}

const getCheckInCheckOut = async (req, res) => {
    try {
        const user = await Users.findById(req.userId)

        if (user) {
            const result = await CheckInCheckOut.find(user.role === "user" ? { employeeId: user._id } : {})
            res.status(200).send(result);
        } else {
            throw new Error('Invalid User !')
        }
    }
    catch (error) {
        console.log("Error", error);
        res.status(422).send({ error: "Error in getting CheckIn & CheckOut" });
    }
}

const getCheckInCheckOutFillter = async (req, res) => {
    try {
        // const id= req.body.employeeId
        // const date= req.body.date
        // console.log(id,date)
        // const result = await CheckInCheckOut.find()
        // console.log(result)
        const result = await CheckInCheckOut.find(req.body)
    
        res.status(200).send(result);
    } catch (error) {
        console.log("Error", error);
        res.status(422).send({ error: "Error in geting CheckIn & CheckOut" });
    }
}

const createCheckIn = async (req, res) => {
    const date = moment().format('L')
    try {
        const user = await Users.findById(req.userId)
        if(!user) throw new Error('User Not Found')
        const findData = await CheckInCheckOut.find({ date, employeeId: user._id })
        if (findData.length !== 0) throw new Error('You Alredy CheckIn')
        const chaeckInCheckOut = CheckInCheckOut({
            employeeId: user._id,
            employeeCode: user.employeeCode || null,
            employeeName: user.firstName + " " + user.lastName,
            date: date,
            checkIn: moment().format("LTS")
        })
        const result = await chaeckInCheckOut.save()
        res.status(200).send(result);
    }
    catch (error) {
        res.status(422).send({ error: "Error in submitting CheckIn & CheckOut" });
    }
}

const updateCheckOut = async (req, res) => {
    const date = moment().format('L')
    try {
        const user = await Users.findById(req.userId)
        if(!user) throw new Error('User Not Found')
        const row = await CheckInCheckOut.findOne({ date, employeeId: user._id, status: "Active" })
        if (row) {
            row.checkOut = moment().format("LTS")
            row.totalWork = getTimeDiffence(row.checkIn, row.checkOut)
            row.status = "Complited"
        } else {
            throw new Error(`Not Found Today's CheckIn`)
        }
        const result = await row.save();
        res.status(200).send(result);
    }
    catch (error) {
        console.log("Error", error);
        res.status(422).send({ error: "Error in updateting CheckIn & CheckOut" });
    }
}

const getUserList = async (req, res) => {

    try {

        const result = await Users.aggregate(
            [
                {
                    $project: {
                        "userName": { $concat: ["$firstName", " ", "$lastName"] },
                        "role":1
                    }
                },
                {
                    $match: {
                        role: "user"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        userName: {"$first":"$userName"}
                    }
                }
            ]
        )
        res.status(200).send(result);
    }
    catch (error) {
        console.log("Error", error);
        res.status(422).send({ error: "Error in Getting UserList" });
    }
}


export default generateControllers(CheckInCheckOut, {
    getCheckInCheckOut,
    getCheckInCheckOutFillter,
    getUserList,
    createCheckIn,
    updateCheckOut
})