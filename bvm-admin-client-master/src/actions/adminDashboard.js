import appConfig from "../config";
import axios from "axios";

export const getOnlineEmployeeList = async(id) => {
    let result = {}
    try {
        const res = await axios.post(`${appConfig.appUrl}/api/watch/online`, { id }, {
            headers: {
                "authorization": `${appConfig.authToken()}`
            }
        })
        result = res.data || {};
        return { success: true, data: result }
    } catch (err) {
        const e = err.response
        console.log("error in getting time info : ", e)
        return { success: false, message: ((e && e.data) && e.data.error) || "something went wrong" }
    }
}
export const getWorkingTime = async(date) => {
    let result = {}
    try {
        const res = await axios.post(`${appConfig.appUrl}/api/watch/workinghours`, date, {
            headers: {
                "authorization": `${appConfig.authToken()}`
            }
        })
        result = res.data || {};
        return { success: true, data: result }
    } catch (err) {
        const e = err.response
        console.log("error in getting time info : ", e)
        return { success: false, message: ((e && e.data) && e.data.error) || "something went wrong" }
    }
}
export const getHolidayList = async(data) => {
    let result = {}
    try {
        const res = await axios.post(`${appConfig.appUrl}/api/holiday/month`, data, {
            headers: {
                "authorization": `${appConfig.authToken()}`
            }
        })
        result = res.data || {};
        return { success: true, data: result }
    } catch (err) {
        const e = err.response
        console.log("error in getting time info : ", e)
        return { success: false, message: ((e && e.data) && e.data.error) || "something went wrong" }
    }
}