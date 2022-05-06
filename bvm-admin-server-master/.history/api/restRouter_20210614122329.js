import express from "express";

import {usersRouter} from "./users";
import {employeeRouter} from "./employee";
import {salaryRouter} from "./salary";
import {watchRouter} from "./watch";
import {reportsRouter} from "./reports";
import {attendanceRouter} from "./attendance";
import {bankInformationRouter} from "./bankinformation";
import {leaveRouter} from "./leave";
import {holidayRouter} from "./holidays";
import { departmentRouter  } from "./department";
import { designationRouter  } from "./designation";
import { courseRouter  } from "./course";
import { studentRouter  } from "./student";


export const restRouter = express.Router();


restRouter.use("/users", usersRouter);
restRouter.use("/employee", employeeRouter);
restRouter.use("/attendance", attendanceRouter );
restRouter.use("/salary", salaryRouter);
restRouter.use("/watch", watchRouter);
restRouter.use("/reports", reportsRouter);
restRouter.use("/bank-information", bankInformationRouter);
restRouter.use("/leave", leaveRouter);
restRouter.use("/holiday", holidayRouter);
restRouter.use("/department", departmentRouter);
restRouter.use("/designation", designationRouter);
restRouter.use("/course", courseRouter);
restRouter.use("/student", studentRouter);
