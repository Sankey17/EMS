import express from "express";
import checkInCheckOutController from "./checkInCheckOut.controller";
import verifyToken from "./checkInCheckOut.middleware";

export const checkInCheckOutRouter = express.Router()

checkInCheckOutRouter
    .route('/')
    .post(verifyToken,checkInCheckOutController.createCheckIn)
    .put(verifyToken,checkInCheckOutController.updateCheckOut)

checkInCheckOutRouter
    .route('/user')
    .post(verifyToken, checkInCheckOutController.getCheckInCheckOut)

checkInCheckOutRouter
    .route('/fillter')
    .post(checkInCheckOutController.getCheckInCheckOutFillter)

checkInCheckOutRouter
    .route('/userlist')
    .get(checkInCheckOutController.getUserList)
