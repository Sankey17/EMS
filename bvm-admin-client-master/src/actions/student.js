import axios from "axios/index";
import appConfig from "../config";

export const postStudent = async (values) => {
  let result = {};
  try {
    const res = await axios.post(
      `${appConfig.appUrl}/api/student/`, values, {
        headers: {
          authorization: `${appConfig.token}`
        }
      }
    );
    result = res.data || {};
    return { success: true, data: result };
  } catch (err) {
    console.log("error in getting time info : ", err);
    return {
      success: false,
      message: (err) || "something went wrong"
    };
  }
};

export const getStudent = async (page, pageSize) => {
  let result = {};
  try {
    const res = await axios.get(
      `${appConfig.appUrl}/api/student/?page=${(page >= 0) ? page : ""}&limit=${pageSize}`, {
        headers: {
          authorization: `${appConfig.token}`
        }
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
export const deleteStudent = async (id) => {
  let result = {};
  try {
    const res = await axios.delete(
      `${appConfig.appUrl}/api/student/${id}`, {
        headers: {
          authorization: `${appConfig.token}`
        }
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

export const getStudentById = async (id) => {
  let result = {};
  try {
    const res = await axios.get(
      `${appConfig.appUrl}/api/student/get/${id}`, {
        headers: {
          authorization: `${appConfig.token}`
        }
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

export const editStudent = async (id, list) => {
  let result = {};
  try {
    const res = await  axios.put(`${appConfig.appUrl}/api/student/${id}`, list,{
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



