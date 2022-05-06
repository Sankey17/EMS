import axios from "axios";
import appConfig from "../config";


export const employeeLength = async () => {
  let result = {};
  try {
    const res = await axios.get(`${appConfig.appUrl}/api/users/count`, {
      headers: { authorization: `${appConfig.token}` }
    });
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


export const uploadImage = async (event) => {
  try {
    const { files } = event.target;

        const url = URL.createObjectURL(files[0]);
        const imageUrl = {
          image: files[0],
          imagePreview: url,
          isImageUpload: true
        }
        if(imageUrl && imageUrl.isImageUpload){
          const image = new FormData();
          image.append("image", imageUrl.image);
          delete imageUrl.image
          delete imageUrl.imagePreview
          delete imageUrl.isImageUpload
          delete imageUrl.icon

          const res = await axios.post(
            "https://api.imgbb.com/1/upload?key=8cf1720dec383d205601b5a1e3a99d7d",
            image,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          if(res && res.data &&res.data.data.delete_url && res.data.data.display_url ){
            const photo = {}
            photo.deleteImageUrl = res.data.data.delete_url
            photo.photo = res.data.data.display_url
            return { success: true, data: photo };
          }else{
            return { done: false, message: "something went wrong"}
          }
        }


  } catch (err) {
    console.log("error in getting time info : ", err);
    return {
      success: false,
      message: (err && err.data && err.data.error) || "something went wrong"
    };
  }
};


export const employeeDetails = async (values) => {
  let result = {};
  try {
    const res = await axios.post(
      `${appConfig.appUrl}/api/employee/updatedetail`,
      values,
      { headers: { authorization: `${appConfig.token}` } }
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


export const findEmployeeEmail = async (id) => {
  try {
    const res = await axios.post(
      `${appConfig.appUrl}/api/employee/find`,
      { id },
      { headers: { authorization: `${appConfig.token}` } }
    );
    return res && res.data
  }catch (e) {
    console.log("Error:-", e)
    return { done: false, message: "Something went wrong"}
  }
}


export const getEmployee = async filter => {
  let result = {};

  try {
    const res = await axios.post(
      `${appConfig.appUrl}/api/employee/getemployee`,
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

export const getAllLeaveDetails = async filter => {
  let result = {};

  try {
    const res = await axios.post(
      `${appConfig.appUrl}/api/leave/search`,
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


export const updateStatus = async (data) => {
  let result = {};
  try {
    const res = await axios.put(
      `${appConfig.appUrl}/api/employee/updateStatus/${data.id}`,
      data,
      { headers: { authorization: `${appConfig.token}` } }
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
