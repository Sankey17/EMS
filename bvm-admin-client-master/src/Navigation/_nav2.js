/*For Empolyees*/

export default {
    items: [{
            name: "Dashboard",
            url: "/dashboard",
            icon: "icon-speedometer",
        },
        {
            name: "Attendance",
            url: "/attendance",
            icon: "icon-speedometer",
        },
        {
            name: "Salary slip",
            url: "/salary-slip",
            icon: "cui-dollar",
        },
        {
            name: "Leave",
            url: "/leaveapplication",
            icon: "cui-envelope-letter",
            children: [{
                    name: "List",
                    url: "/leaveapplication/total-leave-list",
                    icon: "cui-list",
                },
                {
                    name: "Application",
                    url: "/leaveapplication/leave-form",
                    icon: "cui-user-follow",
                },
            ],
        },
        {
            name: "Employee",
            url: "/employee",
            icon: "cui-people",
        },
        {
            name: "Holidays",
            url: "/holidays",
            icon: "fa fa-motorcycle",
        },
        {
            name: 'Check In & Check Out',
            url: "/checkincheckout",
            icon: 'fa fa-calendar'
        },
        {
            name: 'Work Report',
            url: "/workreport",
            icon: "fa fa-tasks",
        }
    ],
};