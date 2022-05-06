import axios from "axios/index";
import appConfig from "../config";
import {REPORT_PAGE_LIMIT} from "../utils/CONST";

  export const getDepartment = async (page, pageSize) => {
  let result = {};
  const quary = `${appConfig.appUrl}/api/department?page=${(page >= 0) ? page : ""}&limit=${pageSize || REPORT_PAGE_LIMIT}`
  try {
    const res =  await axios.get(quary,
      {
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "authorization": `${appConfig.token}`
      }
    })
    result = res.data || {};
    return { success: true, data: result }
  } catch(err) {
    console.log("error in getting time info : ", err);
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};

export const addDepartment = async (department) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/department`, {department},{
      headers: {
        "authorization" : `${appConfig.token}`
      }
    })
    result = res || {};
    return {success: true, data: result}
  } catch(err) {
    return { success: false, message: (err) || "something went wrong" }
  }
};

export const deleteDepartment = async (id) => {
  let result = {};
  try {
    const res = await axios.delete(`${appConfig.appUrl}/api/department/${id}`, {
      headers: {
        "authorization" : `${appConfig.token}`
      }
    })
    result = res || {};
    return {success: true, data: result}
  } catch(err) {
    return { success: false, message: (err) || "something went wrong" }
  }
};

export const editDepartment = async (id, data) => {
  let result = {};
  try {
    const res = await  axios.put(`${appConfig.appUrl}/api/department/${id}`,{data},{
      headers: {"authorization" : `${appConfig.token}`
      }
    })
    result = res || {};
    return {success: true, data: result}
  } catch(err) {
    return { success: false, message: (err) || "something went wrong" }
  }
};


