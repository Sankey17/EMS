import axios from "axios";
import appConfig from "../config";

export const getWorkReport = async () => {
  try {
    const res = await axios.get(`${appConfig.appUrl}/api/workReport`,
      {headers: {authorization: `${appConfig.token}`}}
    );
    return {success: true, data: (res && res.data) || ''}
  } catch (error) {
    const e = error.response
    console.log("error in getting time info : ", e)
    return {success: false, message: (e && e.data && e.data.error) || "something went wrong"}
  }
}
export const creatWorkReport = async (data) => {
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/workReport`, {data},
      {
        headers: {authorization: `${appConfig.token}`, 'Content-Type': 'application/json'},
      }
    );
    return {success: true, data: (res && res.data) || ''}
  } catch (error) {
    const e = error.response
    console.log("error in getting time info : ", e)
    return {success: false, message: (e && e.data && e.data.error) || "something went wrong"}
  }
}

export const getUserReported = async (data) => {
  try {
    const res = await axios.get(`${appConfig.appUrl}/api/workReport/user`,
      {
        headers: {authorization: `${appConfig.token}`, 'Content-Type': 'application/json'},
      }
    );
    return {success: true, data: (res && res.data) || ''}
  } catch (error) {
    const e = error.response
    console.log("error in getting time info : ", e)
    return {success: false, message: (e && e.data && e.data.error) || "something went wrong"}
  }
}

export const getWorkReportFilter = async (employeeId, date) => {
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/workreport/filter`,
      {
        employeeId,
        date
      },
      {
        headers: {authorization: `${appConfig.token}`, 'Content-Type': 'application/json'},
      }
    );
    return {success: true, data: (res && res.data) || ''}
  } catch (error) {
    const e = error.response
    console.log("error in getting time info : ", e)
    return {success: false, message: (e && e.data && e.data.error) || "something went wrong"}
  }
}

export const getWorkReportAdmin = async (user, month, year) => {
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/workreport/admin`, {
        user, month, year
      },
      {
        headers: {authorization: `${appConfig.token}`, 'Content-Type': 'application/json'},
      }
    );
    return {success: true, data: (res && res.data) || ''}
  } catch (error) {
    const e = error.response;
    console.log("error in getting time info : ", e);
    return {success: false, message: (e && e.data && e.data.error) || "something went wrong"}
  }
}


