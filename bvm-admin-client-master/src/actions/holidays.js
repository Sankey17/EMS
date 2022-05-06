import axios from "axios"
import appConfig from "../config";
import {REPORT_PAGE_LIMIT} from "../utils/CONST";

export const createAndUpdateHoliday = async (body) => {
  try {
    const res=  await axios.post(`${appConfig.appUrl}/api/holiday`, body,
      { headers: { authorization: `${appConfig.token}` } });
    return { success: true, data: (res && res.data) || "" };
  } catch (error) {
    const e = error.response
    console.log("error in getting time info : ", e)
    return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
  }
};

export const getHolidays = async (page, pageSize) => {
  try {
    const res = await axios.get(`${appConfig.appUrl}/api/holiday?page=${page}&limit=${pageSize || REPORT_PAGE_LIMIT}`, {
      headers: {
        "authorization" : `${appConfig.authToken()}`
      }
    })
    return { success: true, ...(res.data || {}) }
  } catch (error) {
    const e = error.response
    console.log("error in getting time info : ", error)
    return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
  }
};

export const removeHoliday = async (id) => {
  try {
    const res=  await axios.delete(`${appConfig.appUrl}/api/holiday?id=${id}`,
      { headers: { authorization: `${appConfig.token}` } });
    return { success: true, ...((res && res.data) || {}) };
  } catch (error) {
    const e = error.response
    console.log("error in getting time info : ", e)
    return { success: false, message: (e && e.data && e.data.error) || "something went wrong" }
  }
};
