import axios from "axios";
import appConfig from "../config";
import { REPORT_PAGE_LIMIT } from "../utils/CONST";

export const getTimeInfo = async (date) => {
  let result = {};
  try {
    console.log(appConfig.authToken());
    const res = await axios.get(
      `${appConfig.appUrl}/api/watch/timeinfo?date=${date}`,
      {
        headers: {
          authorization: `${appConfig.authToken()}`,
        },
      }
    );
    result = res.data || {};
    return { success: true, data: result };
  } catch (err) {
    const e = err.response;
    console.log("error in getting time info : ", e);
    return {
      success: false,
      message: (e && e.data && e.data.error) || "something went wrong",
    };
  }
};

export const updateWatch = async (payload, status, key) => {
  let result = {};
  try {
    const res = await axios.put(
      `${appConfig.appUrl}/api/watch/updatewatch?status=${status}&key=${key}`,
      payload,
      {
        headers: {
          authorization: `${appConfig.authToken()}`,
        },
      }
    );
    result = res.data || {};
    return { success: true, data: result };
  } catch (err) {
    const e = err.response;
    console.log("error in updating watch : ", e);
    return {
      success: false,
      message: (e && e.data && e.data.error) || "something went wrong",
    };
  }
};

export const getAllMovementByYear = async (year, userId) => {
  let result = {};
  try {
    if (!year) {
      return { success: false, message: "params missing" };
    }
    const res = await axios.get(
      `${appConfig.appUrl}/api/watch/events?year=${year}&userId=${
        userId || ""
      }`,
      {
        headers: {
          authorization: `${appConfig.authToken()}`,
        },
      }
    );
    result = res.data || {};
    return { success: true, data: result };
  } catch (err) {
    const e = err.response;
    console.log("error in getting time info : ", e);
    return {
      success: false,
      message: (e && e.data && e.data.error) || "something went wrong",
    };
  }
};

export const birthDayCheck = async () => {
  let result = {};

  try {
    const res = await axios.get(`${appConfig.appUrl}/api/users/checkbirthday`, {
      headers: {
        authorization: `${appConfig.authToken()}`,
      },
    });
    result = res.data || {};
    return { success: true, data: result };
  } catch (error) {
    const e = error.response;
    console.log("error in getting time info : ", e);
    return {
      success: false,
      message: (e && e.data && e.data.error) || "something went wrong",
    };
  }
};

export const submitEmployeeReport = async (payload) => {
  let result = {};
  try {
    const res = await axios.post(
      `${appConfig.appUrl}/api/reports/fetch`,
      payload,
      {
        headers: {
          authorization: `${appConfig.authToken()}`,
        },
      }
    );
    result = res.data || {};
    return { success: true, data: result };
  } catch (err) {
    const e = err.response;
    console.log("error in submitting report : ", e);
    return {
      success: false,
      message: (e && e.data && e.data.error) || "something went wrong",
    };
  }
};

export const fetchEmployeeReports = async (page, pageSize) => {
  let result = {};
  try {
    const res = await axios.get(
      `${appConfig.appUrl}/api/reports/fetch?page=${page}&limit=${
        pageSize || REPORT_PAGE_LIMIT
      }`,
      {
        headers: {
          authorization: `${appConfig.authToken()}`,
        },
      }
    );
    result = res.data || {};
    return { success: true, ...result };
  } catch (err) {
    const e = err.response;
    console.log("error in updating watch : ", e);
    return {
      success: false,
      message: (e && e.data && e.data.error) || "something went wrong",
    };
  }
};
