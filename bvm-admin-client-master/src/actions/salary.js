import axios from "axios"
import appConfig from "../config";

export const checkSalaryDetails = async (data) => {
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/salary/checksalary`, data, { headers: { "authorization": `${appConfig.token}` } });
    return res && res.data
  } catch (err) {
    console.log("error in getting time info : ", err);
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};

export const pdf = async (data) => {
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/users/pdf`,
      data,
      {
        headers: { "authorization": `${appConfig.token}` },
        responseType: 'blob'
      })

    return res && res.data
  } catch (err) {
    console.log("error in getting time info : ", err);
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};

export const findEmployeeeId = async (employeeId) => {
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/salary/find`, { employeeId }, { headers: { "authorization": `${appConfig.token}` } });
    return res && res.data
  } catch (err) {
    console.log("error in getting time info : ", err);
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};

export const AllEmployeeSalaryDetails = async () => {
  try {
    const res = await axios.get(`${appConfig.appUrl}/api/salary`, { headers: { "authorization": `${appConfig.token}` } });
    return res && res.data
  } catch (err) {
    console.log("error in getting time info : ", err);
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};

export const getFilterSalaryData = async filter => {
  let result = {};
  try {
    const res = await axios.post(
      `${appConfig.appUrl}/api/salary/filter`,
      filter,
      {
        headers: { authorization: `${appConfig.token}` }
      }
    );
    result = res.data || {};
    return { success: true, data: result };
  } catch (err) {
    console.log("error in getting time info : ", err);
    return {
      success: false,
      message: (err && err.data && err.data.error) || "something went wrong"
    };
  }
};

export const paidSalary = async (send) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/salary`, send, { headers: { "authorization": `${appConfig.token}` } });
    result = res.data || {};
    return { success: true, data: result }
  } catch (err) {
    console.log("error in getting time info : ", err);
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};

