import appConfig from "../config";
import axios from "axios/index";
import {REPORT_PAGE_LIMIT} from "../utils/CONST";

export const postCourse = async (values) => {
  let result = {};
  try {
    const res = await axios.post(
      `${appConfig.appUrl}/api/course/`, values, {
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


export const getCourse = async (page, pageSize) => {
  let result = {};
  try {
    const res = await axios.get(
      `${appConfig.appUrl}/api/course/?page=${(page >= 0) ? page : ""}&limit=${pageSize || REPORT_PAGE_LIMIT}`, {
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

export const deleteCourse = async (id) => {
  let result = {};
  try {
    const res = await axios.delete(
      `${appConfig.appUrl}/api/course/${id}`, {
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

export const editCourse = async (id, course, fees, description) => {
  let result = {};
  const list = {course: course, fees: fees, description: description}
  try {
    const res = await  axios.put(`${appConfig.appUrl}/api/course/${id}`,list, {
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

export const getCourseById = async (id) => {
  let result = {};
  try {
    const res = await axios.get(
      `${appConfig.appUrl}/api/course/get/${id}`, {
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
