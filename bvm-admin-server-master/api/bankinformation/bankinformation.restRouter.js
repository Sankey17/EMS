import express from "express";
import bankInformationController from "./bankinformation.controller";
export const bankInformationRouter = express.Router();


//bankInformationRouter.route("/").get(bankInformationController.getAll).post(bankInformationController.createOne);
bankInformationRouter.route("/:employeeId").get(bankInformationController.getBankInformation);
bankInformationRouter.route("/").put(bankInformationController.updateBankInfo);