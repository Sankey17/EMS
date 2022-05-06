import React from "react";
import DefaultLayout from "./containers/DefaultLayout";
import Reports from "./views/Reports";
import Holidays from "./views/Holidays";
import WorkReportForm from "./views/WorkReport/WorkReportForm";

const Dashboard = React.lazy(() =>
    import ("./views/Dashboard"));
const AdminDashboard = React.lazy(() =>
    import ("./views/AdminDashboard"));
const Login = React.lazy(() =>
    import ("./views/Login"));
const Salary = React.lazy(() =>
    import ("./views/Salary"));
const SalarySlip = React.lazy(() =>
    import ("./views/Salary/Salaryslip"));
const SalaryList = React.lazy(() =>
    import ("./views/Salary/salarylist"));
const Employee = React.lazy(() =>
    import ("./views/Employee"));
const LeaveApplication = React.lazy(() =>
    import ("./views/LeaveApplication"));
const NewEmployee = React.lazy(() =>
    import ("./views/Employee/Details"));
const InActiveEmployee = React.lazy(() =>
    import ("./views/Employee/deactive"));
const EmployeeLeaveList = React.lazy(() =>
    import ("./views/LeaveApplication/AdminViewLeaveList")
);
const EmpTotalLeave = React.lazy(() =>
    import ("./views/LeaveApplication/UserViewLeaveList")
);
const LeaveForm = React.lazy(() =>
    import ("./views/LeaveApplication/Application")
);
const Profile = React.lazy(() =>
    import ("./views/Profile/AdminProfile"));
const EditProfile = React.lazy(() =>
    import ("./views/Profile/AdminProfile/EditProfile")
);
const UserProfile = React.lazy(() =>
    import ("./views/Profile/UserProfile"));
const UserEditprofile = React.lazy(() =>
    import ("./views/Profile/UserProfile"));
const resetPassword = React.lazy(() =>
    import ("./views/ResetPassword"));
const Attendance = React.lazy(() =>
    import ("./views/attendance"));
const AdminAttendanceChart = React.lazy(() =>
    import ("./views/attendance/AdminAttendanceChart")
);
const Department = React.lazy(() =>
    import ("./views/Department"));
const Designation = React.lazy(() =>
    import ("./views/Designation"));
const NewCourse = React.lazy(() =>
    import ("./views/Courses/NewCourse"));
const Course = React.lazy(() =>
    import ("./views/Courses"));
const NewStudent = React.lazy(() =>
    import ("./views/Students/NewStudent"));
const Student = React.lazy(() =>
    import ("./views/Students"));
const TeamManegment = React.lazy(() =>
    import ("./views/TeamManegment/TeamManegment")
);

const CheckInCheckOut = React.lazy(() =>
    import ('./views/CheckInCheckOut/index'));
const WorkReport = React.lazy(() =>
    import ('./views/WorkReport/index'));
const AdminWorkReport = React.lazy(() =>
    import ('./views/WorkReport/Admin/index'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config

/*For Admin*/
/*Company*/
export const routesCompany = [
    { path: "/", name: "Home", component: DefaultLayout, exact: true },
    { path: "/dashboard", name: "Dashboard", component: AdminDashboard },
    { path: "/login", name: "Login", component: Login },
    { path: "/salary", name: "Salary", component: Salary, exact: true },
    { path: "/salary/details", name: "Salary details", component: Salary },
    {
        path: "/salary/list",
        name: "Salary List",
        component: SalaryList,
    },
    {
        path: "/employee",
        name: "Employee",
        component: Employee,
        exact: true,
    },
    {
        path: "/employee/list",
        name: "Employee List",
        component: Employee,
    },
    {
        path: "/employee/edit/:id",
        name: "Edit",
        component: NewEmployee,
    },

    {
        path: "/employee/new",
        name: "New Employee",
        component: NewEmployee,
    },
    {
        path: "/employee/inactive-employee",
        name: "In Active Employees",
        component: InActiveEmployee,
    },
    {
        path: "/attendance",
        name: "Attendance",
        component: AdminAttendanceChart,
    },
    {
        path: "/leaveapplication",
        name: "Leave Application",
        component: LeaveApplication,
        exact: true,
    },
    {
        path: "/employee/leave-list",
        name: "Leave List",
        component: EmployeeLeaveList,
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
    },
    {
        path: "/editprofile",
        name: "Profile",
        component: EditProfile,
    },

    {
        path: "/resetpassword/:id",
        name: "Reset Password",
        component: resetPassword,
    },
    // {
    //   path: "/reports",
    //   name: "Reports",
    //   component: Reports,
    // },
    {
        path: "/holidays",
        name: "Holidays",
        component: Holidays,
    },
    {
        path: "/holidays",
        name: "Holidays",
        component: Holidays,
    },
    {
        path: "/checkincheckout",
        name: "Check In & Check Out",
        component: CheckInCheckOut,
    },
    {
        path: "/department",
        name: "department",
        component: Department,
    },
    {
        path: "/designation",
        name: "designation",
        component: Designation,
    },
    {
        path: "/teammanegment",
        name: "Team Manegment",
        component: TeamManegment,
    },
    {
        path: "/workreport",
        name: "Work Report",
        component: AdminWorkReport,
    },
];

/*For Admin*/
/*Academy*/
export const routesAcademy = [
    { path: "/", name: "Home", component: DefaultLayout, exact: true },
    // { path: "/dashboard", name: "Dashboard", component: AdminDashboard },
    { path: "/login", name: "Login", component: Login },

    {
        path: "/profile",
        name: "Profile",
        component: Profile,
    },
    {
        path: "/editprofile",
        name: "Profile",
        component: EditProfile,
    },

    {
        path: "/resetpassword/:id",
        name: "Reset Password",
        component: resetPassword,
    },
    {
        path: "/course/new",
        name: "New Course",
        component: NewCourse,
    },
    {
        path: "/course",
        name: "Course",
        component: Course,
        exact: true,
    },
    {
        path: "/course/edit/:id",
        name: "Edit",
        component: NewCourse,
    },
    {
        path: "/student/new",
        name: "New",
        component: NewStudent,
    },
    {
        path: "/student",
        name: "Student",
        component: Student,
        exact: true,
    },
    {
        path: "/student/edit/:id",
        name: "Edit",
        component: NewStudent,
    },
];

/*For Empolyees*/

export const routes2 = [
    { path: "/", name: "Home", component: DefaultLayout, exact: true },
    { path: "/dashboard", name: "Dashboard", component: Dashboard },
    { path: "/login", name: "Login", component: Login },
    {
        path: "/leaveapplication",
        name: "Leave Application",
        component: LeaveApplication,
        exact: true,
    },
    {
        path: "/leaveapplication/leave-form",
        name: "LeaveForm",
        component: LeaveForm,
    },
    {
        path: "/leaveapplication/total-leave-list",
        name: "LeaveList",
        component: EmpTotalLeave,
    },
    {
        path: "/resetpassword/:id",
        name: "resetpassword",
        component: resetPassword,
    },
    {
        path: "/profile",
        name: "UserProfile",
        component: UserProfile,
    },
    {
        path: "/editprofile",
        name: "Profile",
        component: UserEditprofile,
    },
    {
        path: "/employee",
        name: "Employee",
        component: Employee,
    },
    {
        path: "/attendance",
        name: "Attendance",
        component: Attendance,
    },
    {
        path: "/salary-slip",
        name: "Salary slip",
        component: SalarySlip,
    },
    {
        path: "/holidays",
        name: "Holidays",
        component: Holidays,
    },
    {
        path: "/checkincheckout",
        name: "Check In & Check Out",
        component: CheckInCheckOut,
    },
    {
        path: "/workreport",
        name: "Work Report",
        component: WorkReport,
    }, {
        path: "/workreportform",
        name: "Work Report Form",
        component: WorkReportForm,
    },
];