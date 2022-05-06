import React, {Component} from "react";
import {Button, CardBody, CardHeader, Col, Row, Input} from "reactstrap";
import {Table} from "antd";
import {connect} from 'react-redux'
import moment from 'moment'
import "react-widgets/dist/css/react-widgets.css";
import logo from "../../assets/img/bvmlogo.png"
import {findEmployeeeId, pdf} from "../../actions";
import {Loader} from "../../globalutilities"

class SalarySlip extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      employeeId: this.props.token.auth.employeeCode || "",
      employeeName: this.props.token.auth.firstName || "",
      designation: this.props.token.auth.designation || "",
      isPaid: true,
      list: [],
      length: ""
    };
  }

  componentDidMount = async () => {
    const {employeeId} = this.state;
    this.setState({
      loading:true
    },async ()=>{
      const findUser = await findEmployeeeId(employeeId);
      if (findUser && findUser.data && findUser.data.length) {
        this.setState({
          list: findUser.data,
          length: findUser.data.length,
        })
      }
      this.setState({
        loading:false
      })
    })

  };

  pdf = async (record) => {
    const {designation} = this.state;
    const data = {
      employeeName: record.firstName,
      designation: designation,
      salary: record.salary,
      logo: logo,
      month: moment().month(record.month).format("MMMM"),
      year: record.year
    };
    this.setState({
      loading:true
    },async ()=>{
      const res = await pdf(data);
      if (res) {
        const file = new Blob([res], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
      this.setState({
        loading:false
      })
    })

  };

  render() {
    const {list, length, loading} = this.state;
    const columns = [
      {
        title: "Employee Id",
        key: "employeeId",
        dataIndex: "employeeId",
        sorter: (a, b) => a.employeeCode.length - b.employeeCode.length
      },
      {
        title: "Name",
        dataIndex: "firstName",
        key: "firstName",
        sorter: (a, b) => a.firstName.length - b.firstName.length
      },
      {
        title: "Salary",
        key: "Salary",
        dataIndex: "salary",
        sorter: (a, b) => a.salary.length - b.salary.length
      },
      {
        title: "Year",
        key: "year",
        dataIndex: "year",
        sorter: (a, b) => a.year.length - b.year.length
      },
      {
        title: "Month",
        key: "month",
        render: (record) => (
          <span>
            {moment().month(record.month).format("MMMM")}
          </span>
        ),
        sorter: (a, b) => a.month.length - b.month.length
      },
      {
        title: "Action",
        key: "action",
        render: (record) => (
          <span>
             <Button className="btn-primary" onClick={() => this.pdf(record)}>Salary Slip</Button>
          </span>
        )
      }
    ];
    return (
      <div className="card">
        {loading ? <Loader/> : null}
        <CardHeader>
          <strong>Employees List</strong>
        </CardHeader>
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
                </Row>
              </Col>
            </Row>
            <br/>
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
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state
  }
};

export default connect(mapStateToProps)(SalarySlip)


