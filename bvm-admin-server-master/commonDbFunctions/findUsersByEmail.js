import { Users } from "../api/users/users.model";

export const getMappedLoggedInUser = async email => {
  let returnObject;
  const regexemail = new RegExp(email, "i");

  try {
    returnObject = await Users.aggregate([
      {
        $match: {
          emailId: email.toLowerCase()
        }
      },
      {
        $project: {
          userId: "$_id",
          name: 1,
          emailId: 1,
          role: 1,
          employeeCode: 1,
          firstName: 1,
          designation:1,
          visited: 1,
          username: 1,
          lastName: 1,
          photo: 1,
          phone: 1
        }
      }
    ]);
  } catch (err) {
    console.log("There is an error");
  }
  return returnObject[0];
};

export const getUserDetails = async email => {
  return await getMappedLoggedInUser(email);
};
