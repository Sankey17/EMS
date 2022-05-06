import axios from "axios"
import appConfig from "../config";

export const leaveFormPost = async (send) => {
  try {
    const res=  await axios.post(`${appConfig.appUrl}/api/leave`,send,
                 { headers: { authorization: `${appConfig.token}` } });
    return (res && res.data) || {};
  } catch (err) {
    console.log("error in getting time info : ", err)
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};

export const leaveUpdate = async (query) => {
  try {
    const res = await axios.post(`${appConfig.appUrl}/api/leave`,
      query,{headers: {"authorization" : `${appConfig.token}`}});
    return res && res.data
  } catch (err) {
    console.log("error in getting time info : ", err)
    return { success: false, message: (err && err.data && err.data.error) || "something went wrong" }
  }
};
