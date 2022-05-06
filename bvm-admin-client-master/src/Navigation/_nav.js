/*For Admin*/

export const company = {
    items: [{
            name: "Dashboard",
            url: "/dashboard",
            icon: "icon-speedometer",
        },
        {
            name: "Employee",
            url: "/employee",
            icon: "cui-people",
            children: [{
                    name: "New Employee",
                    url: "/employee/new",
                    icon: "cui-user-follow",
                },
                {
                    name: "Employee List",
                    url: "/employee",
                    icon: "cui-list",
                },
                {
                    name: "Inactive Employees",
                    url: "/employee/inactive-employee",
                    icon: "nav-icon icon-ban",
                },
            ],
        },
        {
            name: "Attendance",
            url: "/attendance",
            icon: "icon-speedometer",
        },
        {
            name: "Salary Details",
            url: "/salary",
            icon: "cui-dollar",
            children: [{
                    name: "Salary",
                    url: "/salary/details",
                    icon: "cui-dollar",
                },
                {
                    name: "Salary List",
                    url: "/salary/list",
                    icon: "cui-dollar",
                },
            ],
        },
        {
            name: "Leave",
            url: "/leaveapplication",
            icon: "cui-envelope-letter",
            children: [{
                name: "List",
                url: "/employee/leave-list",
                icon: "cui-people",
            }, ],
        },
        // {
        //   name: "Reports",
        //   url: "/reports",
        //   icon: "fa fa-pencil-square-o",
        // },
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
            name: "Department",
            url: "/department",
            icon: "icon-user",
        },
        {
            name: "Designation",
            url: "/designation",
            icon: "fa fa-user-secret fa-lg",
        },
        {
            name: "Team Manegment",
            url: "/teammanegment",
            icon: "fa fa-users",
        },
        {
            name: 'Work Report',
            url: "/workreport",
            icon: "fa fa-tasks",
        }
    ],
};

export const academy = {
    items: [{
            name: "Courses",
            url: "/course",
            icon: "cui-monitor",
            children: [{
                    name: "New Course",
                    url: "/course/new",
                    icon: "cui-user-follow",
                },
                {
                    name: "Course List",
                    url: "/course",
                    icon: "cui-list",
                },
            ],
        },
        {
            name: "Students",
            url: "/student",
            icon: "fa fa-users  ",
            children: [{
                    name: "New Student",
                    url: "/student/new",
                    icon: "cui-user-follow",
                },
                {
                    name: "Student List",
                    url: "/student",
                    icon: "cui-list",
                },
            ],
        },
    ],
};