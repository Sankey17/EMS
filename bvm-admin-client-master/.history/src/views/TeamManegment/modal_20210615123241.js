import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Label, Input, Col, FormGroup } from "reactstrap";
import { Button } from "reactstrap";
import { Select } from "antd";

const { Option } = Select;

export const AddModal = (props) => {
  const [teamleadnamevvalidation, setteamleadnamevvalidation] = useState(false);
  const [departmentvvalidation, setdepartmentvvalidation] = useState(false);
  const [employeevvalidation, setemployeevvalidation] = useState(false);

  const {
    addModal,
    editIndex,
    list,
    departmentList,
    teamleadname,
    department,
    employee,
    getEmployeeDetails,
    fetchDepartment,
    onpopupCancle,
    handleChange,
    departmentHandle,
    tlNmaeHendeler,
    editMode,
    onPopupSubmit,
    onEditpopupSubmit,
  } = props;

  useEffect(() => {
    getEmployeeDetails();
    fetchDepartment();
  }, []);

  const saveSubmit = () => {
    if (teamleadname === "") {
      setteamleadnamevvalidation(true);
    }
    if (department === "") {
      setdepartmentvvalidation(true);
    }
    if (employee.length === 0) {
      setemployeevvalidation(true);
    }
    if (teamleadname !== "" && department !== "" && employee.length !== 0) {
      onPopupSubmit();
    }
  };

  const saveEdit = () => {
    if (teamleadname === "") {
      setteamleadnamevvalidation(true);
    }
    if (department === "") {
      setdepartmentvvalidation(true);
    }
    if (employee.length === 0) {
      setemployeevvalidation(true);
    }
    if (teamleadname !== "" && department !== "" && employee.length !== 0) {
      onEditpopupSubmit();
    }
  };

  return (
    <Modal show={addModal}>
      <Modal.Body>
        <div className="text-center ">
          <h4>
            {!(editIndex && editIndex.length) ? " Add Team" : " Edit Team"}
          </h4>
        </div>
        <Col xs="12">
          <FormGroup>
            <Label htmlFor="teamleadname">Team Lead Name : </Label>
            <Input
              type="select"
              name="teamleadname"
              value={teamleadname}
              onChange={(e) => {
                tlNmaeHendeler(e);
                setteamleadnamevvalidation(false);
              }}
              id="teamleadname"
            >
              <option value="">Select Department</option>
              {list &&
                list.map((data, index) => {
                  return (
                    data.firstName && (
                      <option
                        value={data.firstName + " " + data.lastName}
                        key={index}
                      >
                        {data.firstName + " " + data.lastName}
                      </option>
                    )
                  );
                })}
            </Input>
            {teamleadnamevvalidation && (
              <span className="text-danger">Team Lead Name is Require</span>
            )}
          </FormGroup>
        </Col>
        <Col xs="12">
          <FormGroup>
            <Label htmlFor="department">Department : </Label>
            <Input
              type="select"
              name="department"
              value={department}
              onChange={(e) => {
                departmentHandle(e);
                setdepartmentvvalidation(false);
              }}
              id="department"
            >
              <option value="">Select Department</option>
              {departmentList &&
                departmentList.map((data, index) => {
                  return (
                    <option value={data.name} key={index}>
                      {data.name}
                    </option>
                  );
                })}
            </Input>
            {departmentvvalidation && (
              <span className="text-danger">Department Name is Require</span>
            )}
          </FormGroup>
        </Col>
        <Col xs="12">
          <FormGroup>
            <Label htmlFor="employee">Employee : </Label>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              onChange={(e) => {
                handleChange(e);
                setemployeevvalidation(false);
              }}
              // defaultValue={employee && employee}
            >
              {list &&
                list.map((data, index) => {
                  return (
                    data.firstName && (
                      <option
                        value={data.firstName + " " + data.lastName}
                        key={index}
                      >
                        {data.firstName + " " + data.lastName}
                      </option>
                    )
                  );
                })}
            </Select>
            {/* <Input
              type="select"
              multiple={true}
              name="employee"
              value={employee}
              onChange={(e) => {
                handleChange(e);
                setemployeevvalidation(false);
              }}
            >
              {list &&
                list.map((data, index) => {
                  return (
                    data.firstName && (
                      <option
                        value={data.firstName + " " + data.lastName}
                        key={index}
                      >
                        {data.firstName + " " + data.lastName}
                      </option>
                    )
                  );
                })}
            </Input> */}
            {employeevvalidation && (
              <span className="text-danger">Employee is Require</span>
            )}
          </FormGroup>
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <Button
            // onClick={!editMode ? onPopupSubmit : onEditpopupSubmit}
            onClick={!editMode ? saveSubmit : saveEdit}
            className="mr-2"
            color="success"
          >
            Submit
          </Button>
          <Button
            color="danger"
            onClick={() => {
              onpopupCancle();
              setteamleadnamevvalidation(false);
              setdepartmentvvalidation(false);
              setemployeevvalidation(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
