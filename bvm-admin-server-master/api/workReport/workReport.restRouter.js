import express from "express";
import workReportController from "./workReport.controller";
import verifyToken from './workReport.middleware'

export const workReportRouter = express.Router()

workReportRouter
    .route('/')
    .post(verifyToken, workReportController.creatWorkReport)
    .get(verifyToken, workReportController.getWorkReport)

workReportRouter
    .route('/user')
    .get(verifyToken,workReportController.getUserReported)

workReportRouter
    .route('/filter')
    .post(verifyToken,workReportController.getWorkReportFilter)

workReportRouter
    .route('/admin')
    .post(verifyToken,workReportController.getWorkReportAdmin)
