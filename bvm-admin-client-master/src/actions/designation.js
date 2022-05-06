import axios from "axios/index";
import appConfig from "../config";
import {REPORT_PAGE_LIMIT} from "../utils/CONST";

export const addDesignation = async (userData) => {
  const department = userData.departmentId
  const designation = userData.designation
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/designation`, {department: department, designation: designation}, {
      headers: {
        "authorization" : `${appConfig.token}`
      }
    })
    result = res || {};
    return {success: true, data: result}
  } catch(err) {
    return { success: false, message: (err) || "something went wrong" }
  }
}

export const  getDesignation = async (page, pageSize) => {
  let result = {};
  const quary = `${appConfig.appUrl}/api/designation?page=${(page >= 0) ? page : ""}&limit=${pageSize || REPORT_PAGE_LIMIT}`
  try {
    const res =  await axios.get(quary, {
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "authorization": `${appConfig.token}`
      }
    })
    result = res.data || {};
    return { success: true, data: result }
  } catch(err) {
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};

export const deleteDesignation = async (index) => {
  let result = {};
  try {
    const res = await axios.delete(`${appConfig.appUrl}/api/designation/${index}`, {
      headers:
          {"authorization" : `${appConfig.token}`
          }
    })
    result = res || {};
    return {success: true, data: result}
  } catch(err) {
    return { success: false, message: (err) || "something went wrong" }
  }
};

export const editDesignationData = async (index, department, designation) => {
  let result = {};
  try {
    const res = await  axios.put(`${appConfig.appUrl}/api/designation/${index}`,{department: department, designation: designation},{
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

