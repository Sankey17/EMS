import axios from "axios"
import appConfig from "../config";

export const updateProfile = async (_id, values) => {
  let result = {}
  try {
    const res = await axios.put(`${appConfig.appUrl}/api/users/updateprofiledetails/${_id}`, values,{headers: {"authorization" : `${appConfig.token}`}});
    result = res.data || {};
    return { success: true, data: result }
  } catch (err) {
    console.log("error in getting time info : ", err)
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
}
