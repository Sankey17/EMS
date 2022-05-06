import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { AddModal } from "./modal.js";
import { useDispatch } from "react-redux";
import axios from "axios";

import "antd/dist/antd.css";
import { Table } from "antd";

import { getEmployee } from "../../actions";
import { getDepartment } from "../../actions";

const TeamManegment = () => {
  const [addModal, setaddModal] = useState(false);
  const [editIndex, seteditIndex] = useState("");
  const [departmentId, setdepartmentId] = useState("");

  const [list, setlist] = useState("");
  const [departmentList, setdepartmentList] = useState("");
  const [teamleadname, setteamleadname] = useState("");
  const [department, setdepartment] = useState("");
  const [employee, setemployee] = useState([]);
  const [editMode, seteditMode] = useState(false);
  const [editId, seteditId] = useState("");
  const [tableNo, settableNo] = useState(0);

  const [data, setdata] = useState([]);

  const dispatch = useDispatch();

  const fatchUsers = async () => {
    await axios
      .get("http://localhost:8080/api/teammanagement")
      .then((response) => {
        console.log(response.data);
        setdata(response.data);
      })
      .catch((err) => {
        console.log("Error found", err);
      });
  };

  useEffect(() => {
    fatchUsers();
  }, []);

  const deleteData = async (id) => {
    await axios
      .delete(`http://localhost:8080/api/teammanagement/${id}`)
      .then((response) => {
        setdata(data.filter(({ _id }) => _id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const expandedRowRender = (id) => {
    console.log(id);
    const columns = [
      {
        title: "#",
        key: "title",
        render: (record, data, index) => {
          return (
            <div>
              {/* {settableNo(index + 1)} */}
              <span>{index + 1}</span>
            </div>
          );
        },
      },
      {
        title: " Employees",
        dataIndex: "employee",
        key: "employee",
        // render: (record, data, index) => data,
        sorter: (a, b) => a.employee.length - b.employee.length,
      },

      {
        title: "Designation",
        dataIndex: "Designation",
        key: "Designation",
        sorter: (a, b) => a.Designation.length - b.Designation.length,
      },
      {
        title: "Action",
        key: "operation",
        render: (record, data) => (
          <div>
            <Button
              size="sm"
              className="btn-behance btn-brand mr-1 mb-1"
              onClick={() =>
                this.editTeamData(
                  data._id,
                  data.departmentId[0]._id,
                  data.departmentId[0].name,
                  data.designationName
                )
              }
            >
              <i className="fa fa-edit" />
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              className="btn-danger btn-brand mr-1 mb-1"
              onClick={() => deleteData(data._id)}
            >
              <i className="fa fa-trash-o" />
              <span>Remove</span>
            </Button>
          </div>
        ),
      },
    ];

    console.log(tableNo);

    // data.map((item, index) => {
    //   item.employee.map((item, index) => {
    //     console.log(item, index);
    //   });
    // });

    // let data1 = [];

    // data[tableNo - 1].employee.map((item, index) => {
    //   console.log(item, index);
    //   data1.push({
    //     key: index,
    //     Employees: item,
    //     Designation: "REACT",
    //   });
    // });

    // console.log(data1);

    const data1 = [];
    data[0].employee.map((val, i) => {
      console.log("val", val);
      data1.push({
        // key: i,
        Employees: val,
        Designation: "REACT",
      });
      console.log("data1*****", data1);
    });
    return (
      <Table
        columns={columns}
        dataSource={data1}
        pagination={false}
        rowKey={(e) => e._id}
      />
    );
  };

  const editTeamData = async (id, name, department1, employee1) => {
    seteditId(id);
    seteditMode(true);
    setaddModal(true);
    setteamleadname(name);
    setdepartment(department1);
    setemployee(employee1);
  };

  const getEmployeeDetails = async (filter) => {
    const res = await getEmployee(filter);
    if (res && res.data && res.data.length) {
      setlist(res.data);
    } else {
      setlist("");
    }
  };

  const fetchDepartment = async () => {
    const res = await getDepartment();
    if (res && res.data) {
      setdepartmentList(res.data);
    } else {
      setdepartmentList("");
    }
  };
  const handleCancel = () => {
    setaddModal(false);
    setdepartmentId("");
    seteditIndex("");
    setdepartment("");
    setemployee("");
    setteamleadname("");
  };

  const onpopupCancle = () => {
    handleCancel();
    setteamleadname("");
    setdepartment("");
    setemployee("");
  };

  const handleChange = (e) => {
    let target = e.target;
    let name = target.name;

    let value = Array.from(target.selectedOptions, (option) => option.value);
    setemployee(value);
  };

  const tlNmaeHendeler = (e) => {
    setteamleadname(e.target.value);
  };

  const departmentHandle = (e) => {
    setdepartment(e.target.value);
  };

  const onPopupSubmit = () => {
    axios
      .post("http://localhost:8080/api/teammanagement", {
        teamleadname: teamleadname,
        department: department,
        employee: employee,
        totalemployee: employee.length,
      })
      .then((response) => {
        console.log(response.data);
        setdata([...data, response.data]);
      })
      .catch((error) => {
        console.log("error is ", error);
      });
    handleCancel();
    // settableNo(index + 1);
  };

  const onEditpopupSubmit = () => {
    return (
      axios
        .patch(`http://localhost:8080/api/teammanagement/${editId}`, {
          teamleadname: teamleadname,
          department: department,
          employee: employee,
          totalemployee: employee.length,
        })
        .then((response) => {
          console.log(response.data);
          let newdata = data.map((val, i) =>
            val._id === editId ? response.data : val
          );

          console.log(newdata);
          setdata(newdata);
        })
        .catch((error) => {
          console.log(error);
        }),
      handleCancel()
    );
  };

  const columns = [
    {
      title: "#",
      key: "title",
      render: (record, data, index) => <span>{index + 1}</span>,
    },
    {
      title: "Team Lead Name",
      dataIndex: "teamleadname",
      key: "teamleadname",
      sorter: (a, b) => a.teamleadname.length - b.teamleadname.length,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      sorter: (a, b) => a.department.length - b.department.length,
    },
    {
      title: "Total Employess",
      dataIndex: "totalemployee",
      key: "totalemployee",
      sorter: (a, b) => a.totalemployee - b.totalemployee,
    },

    {
      title: "Action",
      key: "operation",
      render: (record, data) => (
        <div>
          <Button
            size="sm"
            className="btn-behance btn-brand mr-1 mb-1"
            onClick={() =>
              editTeamData(
                data._id,
                data.teamleadname,
                data.department,
                data.employee
              )
            }
          >
            <i className="fa fa-edit" />
            <span>Edit</span>
          </Button>
          <Button
            size="sm"
            className="btn-danger btn-brand mr-1 mb-1"
            onClick={() => deleteData(data._id)}
          >
            <i className="fa fa-trash-o" />
            <span>Remove</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button
        block
        color="primary"
        className="btn-success btn-pill w-auto float-right pointer"
        onClick={() => setaddModal(true)}
      >
        <i className="fa fa-plus fa-lg" />
        &nbsp;&nbsp; Add Team
      </Button>
      <br />
      <br />

      <Table
        rowKey={(e) => e._id}
        className="components-table-demo-nested"
        columns={columns}
        expandedRowRender={expandedRowRender}
        dataSource={data}
      />

      <AddModal
        addModal={addModal}
        handleCancel={handleCancel}
        teamleadname={teamleadname}
        list={list}
        departmentList={departmentList}
        departmentId={departmentId}
        department={department}
        employee={employee}
        editIndex={editIndex}
        getEmployeeDetails={getEmployeeDetails}
        fetchDepartment={fetchDepartment}
        onpopupCancle={onpopupCancle}
        handleChange={handleChange}
        departmentHandle={departmentHandle}
        tlNmaeHendeler={tlNmaeHendeler}
        editMode={editMode}
        editId={editId}
        onPopupSubmit={onPopupSubmit}
        onEditpopupSubmit={onEditpopupSubmit}
      />
    </div>
  );
};

export default TeamManegment;
