import axios from "axios";
import appConfig from "../config";

export const createCheckIn = async () => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/api/checkInCheckOut`, {},
            { headers: { authorization: `${appConfig.token}` } }
        );
        return { success: true, data: (res && res.data) || '' }
    }
    catch (error) {
        const e = error.response
        console.log("error in getting time info : ", e)
        return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
    }
}
export const updateCheckOut = async () => {
    try {
        const res = await axios.put(`${appConfig.appUrl}/api/checkInCheckOut`, {},
            {
                headers: { authorization: `${appConfig.token}`, 'Content-Type': 'application/json' },
            }
        );
        return { success: true, data: (res && res.data) || '' }
    }
    catch (error) {
        const e = error.response
        console.log("error in getting time info : ", e)
        return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
    }
}

export const getCheckInCheckOut = async () => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/api/checkInCheckOut/user`, {},
            {
                headers: { authorization: `${appConfig.token}`, 'Content-Type': 'application/json' },
            }
        );
        return { success: true, data: (res && res.data) || '' }
    }
    catch (error) {
        const e = error.response
        console.log("error in getting time info : ", e)
        return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
    }
}

// export const getCheckInCheckOutByID = async (id) => {
//     try {
//         const res = await axios.post(`${appConfig.appUrl}/api/checkInCheckOut/Id`,
//             {
//                 id
//             },
//             {
//                 headers: { authorization: `${appConfig.token}`, 'Content-Type': 'application/json' },
//             }
//         );
//         return { success: true, data: (res && res.data) || '' }
//     }
//     catch (error) {
//         const e = error.response
//         console.log("error in getting time info : ", e)
//         return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
//     }
// }

// export const getCheckInCheckOutByDate = async (date) => {
//     try {
//         const res = await axios.post(`${appConfig.appUrl}/api/checkInCheckOut/date`,
//             {
//                 date
//             },
//             {
//                 headers: { authorization: `${appConfig.token}`, 'Content-Type': 'application/json' },
//             }
//         );
//         return { success: true, data: (res && res.data) || '' }
//     }
//     catch (error) {
//         const e = error.response
//         console.log("error in getting time info : ", e)
//         return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
//     }
// }

export const getCheckInCheckOutFillter = async (employeeId, date) => {
    try {
        const res = await axios.post(`${appConfig.appUrl}/api/checkInCheckOut/fillter`,
            {
                employeeId,
                date
            },
            {
                headers: { authorization: `${appConfig.token}`, 'Content-Type': 'application/json' },
            }
        );
        return { success: true, data: (res && res.data) || '' }
    }
    catch (error) {
        const e = error.response
        console.log("error in getting time info : ", e)
        return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
    }
}

export const getUserList = async () => {
    try {
        const res = await axios.get(`${appConfig.appUrl}/api/checkInCheckOut/userlist`, {},
            {
                headers: { authorization: `${appConfig.token}`, 'Content-Type': 'application/json' },
            }
        );
        return { success: true, data: (res && res.data) || '' }
    }
    catch (error) {
        const e = error.response
        console.log("error in getting time info : ", e)
        return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
    }
}