import axios from "axios"
import appConfig from "../config";

export const getBankInfo = async (id) => {
  try {
    const res=  await axios.get(`${appConfig.appUrl}/api/bank-information/${id}`,//`${appConfig.appUrl}/api/employee/application`,
      { headers: { authorization: `${appConfig.token}` } });
    return (res && res.data )|| {};
  } catch (err) {
    console.log("error in getting bank info : ", err);
    return { success: false, message: ((err && err.data) && err.data.error) || "something went wrong" }
  }
};

export const updateBankInfo = async (body) => {
  try {
    const res=  await axios.put(`${appConfig.appUrl}/api/bank-information`,//`${appConfig.appUrl}/api/employee/application`,
      body,{ headers: { authorization: `${appConfig.token}` } });
    return (res && res.data) || {};
  } catch (err) {
    console.log("error in getting bank info : ", err);
    return { success: false, message: ((err && err.data) && err.data.error) || "something went wrong" }
  }
};


