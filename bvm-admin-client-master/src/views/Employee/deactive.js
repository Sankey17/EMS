import React from "react";
import moment from "moment";
import { Input, Row, Col, Button, CardHeader } from "reactstrap";
import { Table } from "antd";
import { DetailsModal } from "../Modal";
import { updateStatus, getEmployee } from "../../actions";
import { Loader } from "../../globalutilities";

class DeactiveEmployee extends React.Component {
  state = {
    list: [],
    show: false,
    index: "",
    status: "active",
    loading: false,
    length: "",
  };

  getEmployeeDetails = (filter) => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        const res = await getEmployee(filter);
        if (res && res.data) {
          this.setState({
            list: res.data,
            length: res.data.length,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      }
    );
  };

  componentDidMount = async () => {
    await this.getEmployeeDetails({ status: "inactive" });
  };

  getSearchResult = (e) => {
    let searchText = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (searchText === "") {
        this.getEmployeeDetails({ status: "inactive" });
      } else {
        this.getEmployeeDetails({
          status: "inactive",
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

  handleClose = () => this.setState({ show: false });

  handleShow = (i) => this.setState({ show: true, index: i });

  activateEmployee = async () => {
    this.setState({ show: false });
    const { list, index } = this.state;
    const res = await updateStatus({ id: list[index]._id, status: "active" });
    if (res && res.data) {
      await this.getEmployeeDetails({ status: "inactive" });
    }
  };

  render() {
    const { list, show, length } = this.state;
    const columns = [
      {
        title: "Employee Codes",
        key: "Employee Codes",
        dataIndex: "employeeCode",
        sorter: (a, b) =>
          a.employeeCode > b.employeeCode
            ? 1
            : b.employeeCode > a.employeeCode
            ? -1
            : 0,
      },
      {
        title: "Name",
        dataIndex: "firstName",
        key: "firstName",
        sorter: (a, b) => a.firstName.length - b.firstName.length,
      },
      {
        title: "Email",
        key: "email",
        dataIndex: "email",
        sorter: (a, b) => a.email.length - b.email.length,
      },
      {
        title: "Designation",
        key: "designation",
        dataIndex: "designation",
        sorter: (a, b) => a.designation.length - b.designation.length,
      },
      {
        title: "Date Of Join",
        key: "dateOfJoin",
        render: (record) => (
          <span>{moment(record.dateOfJoin).format("DD/MM/YYYY")}</span>
        ),
        sorter: (a, b) =>
          a.dateOfJoin > b.dateOfJoin
            ? 1
            : b.dateOfJoin > a.dateOfJoin
            ? -1
            : 0,
      },
      {
        title: "Action",
        key: "action",
        render: (record, data, index) => (
          <span>
            <Button
              className="btn-success"
              onClick={() => this.handleShow(index)}
            >
              Activate
            </Button>
          </span>
        ),
      },
    ];

    return (
      <div className="card">
        <CardHeader>
          <strong>Inactivated Employee List</strong>
        </CardHeader>
        {this.state.loading ? <Loader /> : null}
        <DetailsModal
          show={show}
          handleClose={this.handleClose}
          updateStatus={this.activateEmployee}
        />
        <div className="card-body">
          <Row className="mb-3">
            <Col md="3">
              <Input
                type="text"
                id="search"
                name="search"
                placeholder="Search"
                onChange={this.getSearchResult}
              />
            </Col>
          </Row>
          <Row className="table-responsive">
            <Table
              rowKey={(record) => record._id}
              pagination={{
                defaultCurrent: 1,
                total: length,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30"],
              }}
              columns={columns}
              dataSource={list}
            />
          </Row>
        </div>
      </div>
    );
  }
}

export default DeactiveEmployee;
