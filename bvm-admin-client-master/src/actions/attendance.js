import axios from "axios"
import appConfig from "../config";

export const getAttendanceData = async (employeeCode) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/watch/attendance`,{employeeCode},{headers: {"authorization" : `${appConfig.token}`}});
    result = res.data || {};
    return { success: true, data: result }
  } catch (err) {
    console.log("error in getting time info : ", err);
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};

export const getAttendanceChart = async (year, month) => {
  let result = {};
  try {
    const res = await axios.get(`${appConfig.appUrl}/api/attendance/chart?month=${month}&year=${year}`,
      {
        headers: {
          "authorization" : `${appConfig.token}`
        }
      });
    result = res.data || {};
    return { success: true, data: result }
  } catch (err) {
    console.log("error in getting time info : ", err);
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};

export const manuallyUpdateWatch = async (payload) => {
  let result = {}
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/watch/updatewatch`, payload, {
      headers: {
        "authorization" : `${appConfig.authToken()}`
      }
    })
    result = res.data || {}
    return { success: true, data: result }
  } catch (err) {
    const e = err.response
    console.log("error in updating watch : ", e)
    return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
  }
}
