import React, { Component } from "react";
import {
  Input,
  Row,
  Col,
  Button,
  CardHeader,
  CardBody,
  Card,
} from "reactstrap";
import { Icon } from "antd";
import { connect } from "react-redux";
import { getEmployee, updateStatus, getDesignation } from "../../actions";
import FilterCard from "./collapse";
import { Loader, qualificationValue } from "../../globalutilities";
import avatar from "../../assets/img/download.png";

class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      duplicateList: [],
      record: "",
      collapse: false,
      index: "",
      employeeCode: "",
      name: "",
      email: "",
      phone: "",
      qualification: "",
      designation: "",
      date: "",
      gender: "",
      show: false,
      length: "",
      status: "inactive",
      loading: false,
      designationValue: [],
    };
  }

  getEmployeeDetails = (filter) => {
    this.setState({ loading: true }, async () => {
      const res = await getEmployee(filter);
      if (res && res.data && res.data.length) {
        console.log(res.data);
        this.setState({
          list: res.data,
          loading: false,
          duplicateList: res.data,
          length: res.data.length,
        });
      } else {
        this.setState({ list: "", loading: false, record: "No Record Found" });
      }
    });
  };

  componentDidMount = async () => {
    const designationValue = await getDesignation();
    await this.getEmployeeDetails({ status: "active" });
    this.setState({
      designationValue: designationValue,
    });
  };

  getSearchResult = (e) => {
    let searchText = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (searchText === "") {
        this.getEmployeeDetails({ status: "active" });
      } else {
        this.getEmployeeDetails({
          status: "active",
          $or: [
            {
              firstName: searchText,
            },
            {
              lastName: searchText,
            },
            { email: searchText },
          ],
        });
      }
    }, 800);
  };

  update = (index) => {
    const { list } = this.state;
    const editData = list[index];
    this.props.history.push(`/employee/edit/${editData._id}`, { editData });
  };

  changeEmployeeStatus = async () => {
    const { list, index } = this.state;
    const res = await updateStatus({ id: list[index]._id, status: "inactive" });
    if (res && res.data) {
      await this.getEmployeeDetails({ status: "active" });
    }
    this.setState({ show: false, index: "" });
  };

  filterSubmit = async () => {
    const {
      name,
      employeeCode,
      email,
      phone,
      qualification,
      designation,
      date,
    } = this.state;
    const filterData = { status: "active" };
    if (name) {
      filterData.firstName = name;
    }
    if (employeeCode) {
      filterData.employeeCode = employeeCode;
    }
    if (email) {
      filterData.email = email;
    }
    if (phone) {
      filterData.phone = phone;
    }
    if (qualification) {
      filterData.qualification = qualification;
    }
    if (designation) {
      filterData.designation = designation;
    }
    if (date) {
      filterData.dateOfBirth = date;
    }

    await this.getEmployeeDetails(filterData);
  };

  handleModal = (i, name) => {
    if (window.confirm(`Are you sure? you want to delete ${name}`)) {
      this.setState(
        {
          show: !this.state.show,
          index: i,
        },
        () => this.changeEmployeeStatus()
      );
    }
  };

  newEmployee = () => this.props.history.push("employee/new");

  filterOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  toggle = () => {
    if (this.state.collapse) {
      this.getEmployeeDetails({ status: "active" });
    }
    this.setState((state) => ({ collapse: !state.collapse }));
  };

  render() {
    const {
      employeeCode,
      name,
      email,
      phone,
      designation,
      date,
      qualification,
      show,
      list,
      collapse,
      length,
      designationValue,
    } = this.state;
    /* const columns = [
      {
        title: "Employee Codes",
        key: "employeeCode",
        dataIndex: "employeeCode",
        sorter: (a, b) => a.employeeCode.length - b.employeeCode.length
      },
      {
        title: "Name",
        dataIndex: "firstName",
        key: "firstName",
        sorter: (a, b) => a.firstName.length - b.firstName.length
      },
      {
        title: "Email",
        key: "email",
        dataIndex: "email",
        sorter: (a, b) => a.email.length - b.email.length
      },
      {
        title: "Designation",
        key: "designation",
        dataIndex: "designation",
        sorter: (a, b) => a.designation.length - b.designation.length
      },
      {
        title: "Date Of Join",
        key: "dateOfJoin",
        render: record => (
          <span>{moment(record.dateOfJoin).format("DD/MM/YYYY")}</span>
        ),
        sorter: (a, b) =>
          a.dateOfJoin > b.dateOfJoin ? 1 : b.dateOfJoin > a.dateOfJoin ? -1 : 0
      },
      {
        title: "Action",
        key: "action",
        render: (record, data, index) => (
          <span>
            <Icon
              className="mr-4 pointer"
              type="edit"
              theme="filled"
              style={{fontSize: "20px", color: "blue"}}
              onClick={() => this.update(index)}
            />
            <Icon
              className="pointer"
              type="delete"
              theme="filled"
              style={{fontSize: "20px", color: "red"}}
              onClick={() => this.handleModal(index)}
            />
          </span>
        )
      }
    ]; */
    console.log(list);

    return (
      <div className="card">
        <CardHeader>
          <strong>Employees List</strong>
        </CardHeader>
        {this.state.loading ? <Loader /> : null}
        <CardBody>
          <div className="card-body">
            <Row>
              <Col lg="12">
                <Row>
                  <Col md="9" xs="5">
                    <Input
                      type="text"
                      id="search"
                      name="search"
                      placeholder="Search"
                      onChange={this.getSearchResult}
                    />
                  </Col>
                  <Col md="1" xs="2">
                    <i
                      className="fa fa-filter fa-2x pointer"
                      aria-hidden="true"
                      onClick={this.toggle}
                    />
                  </Col>
                  <Col md="2" xs="2">
                    <Button className="btn-primary" onClick={this.newEmployee}>
                      New Employee
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <br />
            <br />
            <FilterCard
              designationValue={designationValue}
              qualificationValue={qualificationValue}
              employeeCode={employeeCode}
              name={name}
              email={email}
              phone={phone}
              designation={designation}
              date={date}
              qualification={qualification}
              collapse={collapse}
              filterOnChange={this.filterOnChange}
              filterSubmit={this.filterSubmit}
            />
            <Row>
              {list &&
                list.map((v, i) => (
                  <Col key={i} xs="12" sm="6" lg="3">
                    <Card className="border-secondary box-info info-box__shadow">
                      <CardBody className="text-center">
                        {this.props.auth && this.props.auth.role === "admin" ? (
                          <Icon
                            className="pointer float-right text-danger"
                            type="delete"
                            theme="filled"
                            onClick={() =>
                              this.handleModal(
                                i,
                                `${v.firstName} ${v.lastName}`
                              )
                            }
                          />
                        ) : null}
                        <div
                          className="avatar"
                          style={{ width: 70, height: 70 }}
                        >
                          <img
                            src={v.photo || avatar}
                            className="img-avatar pointer"
                            alt="admin@bootstrapmaster.com"
                          />
                        </div>
                        <div className="chart-wrapper mt-3" align="center">
                          <div className="text-black-50 text-uppercase">
                            <b>
                              {v.firstName}&nbsp;{v.lastName}
                            </b>
                          </div>
                          <p className="text-muted">
                            <b>{v.designation}</b>
                          </p>
                          {this.props.auth &&
                          this.props.auth.role === "admin" ? (
                            <Button
                              className="btn-info"
                              onClick={() => this.update(i)}
                            >
                              View Profile
                            </Button>
                          ) : null}
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        </CardBody>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: (state && state.auth) || {},
  };
};

export default connect(mapStateToProps)(Employee);

/* <div className="card">
 <CardHeader>
    <strong>Employees List</strong>
  </CardHeader>
  {this.state.loading ? <Loader/> : null}
  <CardBody>
    <div className="card-body">
      <Row>
        <Col lg="12">
          <Row>
            <Col md="9" xs="5">
              <Input
                type="text"
                id="search"
                name="search"
                placeholder="Search"
                onChange={this.getSearchResult}
              />
            </Col>
            <Col md="1" xs="2">
              <i
                className="fa fa-filter fa-2x pointer"
                aria-hidden="true"
                onClick={this.toggle}
              />
            </Col>
            <Col md="2" xs="2">
              <Button className="btn-primary" onClick={this.newEmployee}>
                New Employee
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <br/>
      <DetailsModal
        show={show}
        handleClose={this.handleClose}
        updateStatus={this.changeEmployeeStatus}
      />
      <FilterCard
        designationValue={designationValue}
        qualificationValue={qualificationValue}
        employeeCode={employeeCode}
        name={name}
        email={email}
        phone={phone}
        designation={designation}
        date={date}
        qualification={qualification}
        collapse={collapse}
        filterOnChange={this.filterOnChange}
        filterSubmit={this.filterSubmit}
      />
      <Row className="table-responsive">
        <Table
          rowKey={record => record._id}
          pagination={{
            defaultCurrent: 1,
            total: length,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30"]
          }}
          columns={columns}
          dataSource={list}
        />
      </Row>
    </div>
  </CardBody>
</div>*/
