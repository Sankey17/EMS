import React, {Component} from "react";
import {Button, Card, CardBody, CardHeader, Col, Input, Row} from "reactstrap";
import {Table} from "antd";
import {connect} from 'react-redux'
import moment from 'moment'
import "react-widgets/dist/css/react-widgets.css";
import {AllEmployeeSalaryDetails, getEmployee, getFilterSalaryData, pdf} from "../../actions";
import SalaryFilter from "./filter";
import logo from "../../assets/img/bvmlogo.png";
import {Loader,totalMonths} from "../../globalutilities";

class SalaryList extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      list: [],
      length: "",
      collapse: false,
      loading: false,
      yearValue: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      employeeCode: "",
      firstName: "",
      salary: "",
      month: "",
      year: "",
      field: {}
    };
  }

  salaryListDetails = async () => {
    const {employeeId} = this.state;
    this.setState({
      loading:true
    },async ()=>{
      const findUser = await AllEmployeeSalaryDetails(employeeId);
      if (findUser && findUser.length) {
        this.setState({
          list: findUser,
          length: findUser.length,
          loading:false
        })
      }else{
        this.setState({
          loading:false
        })
      }
    })

  };

  componentDidMount = async () => {
    await this.salaryListDetails()
  };

  getFilterSalaryDetails = async filter => {
    this.setState({
      loading:true
    },async ()=>{
      const res = await getFilterSalaryData(filter);
      if (res && res.data && res.data.length) {
        this.setState({
          list: res.data,
          duplicateList: res.data,
          length: res.data.length,
          loading:false
        });
      } else {
        this.setState({list: "", record: "No Record Found",loading:false});
      }
    })
  };

  pdf = async (record) => {
    const query = {employeeCode: record.employeeId};
    this.setState({ loading:true},async ()=>{
      const response = await getEmployee(query);
      if (response && response.data) {
        const data = {employeeName:record.firstName,
          designation:response.data[0].designation,
          salary: record.salary,
          logo,
          month:moment().month(record.month).format("MMMM"),
          year: record.year
        };
        const res = await pdf(data);
        if (res) {
          const file = new Blob([res], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.setState({
            loading:false
          })
        }else{
          this.setState({
            loading:false
          })
        }

      }else{
        this.setState({
          loading:false
        })
      }
    })

  };

  toggle = () => {
    if (this.state.collapse) {
      this.salaryListDetails();
    }
    this.setState(state => ({collapse: !state.collapse}));
  };

  filterOnChange = e => {
    const {field} = this.state;
    const {name, value} = e.target;
    this.setState({
      field: {
        ...field,
        [name]: value
      }
    })
  };

  getSearchResult = async (value) =>{
    if(value){
      await this.getFilterSalaryDetails({"firstName":value});
    }else{
      await this.salaryListDetails()
    }
  }

  filterSubmit = async () => {
    const {
      field
    } = this.state;
    const filterData = {};
    if (field.firstName) {
      filterData.firstName = field.firstName;
    }
    if (field.employeeCode) {
      filterData.employeeId = field.employeeCode;
    }
    if (field.year) {
      filterData.year = field.year;
    }
    if (field.month) {
      const month = moment().month(field.month).format("M");
      filterData.month = month - 1;
    }
    if (field.salary) {
      filterData.salary = field.salary;
    }
    await this.getFilterSalaryDetails(filterData);
  };

  render() {
    const {list, length, collapse, yearValue, field, loading} = this.state;
    let totalPaid = 0
    let totalRamain = 0
    list.filter(salary => salary.status === "paid").forEach(salary => { totalPaid = totalPaid + parseInt(salary.salary) })
    list.filter(salary => salary.status !== "paid").forEach(salary => { totalRamain = totalRamain + parseInt(salary.salary) })

    const columns = [
      {
        title: "Employee Id",
        key: "employeeId",
        dataIndex: "employeeId",
        sorter: (a, b) => a.employeeId - b.employeeId
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
        title: "Status",
        key: "status",
        dataIndex: "status",
        sorter: (a, b) => a.status.length - b.status.length,
        render: (status) => (
          <div>
            {
              status === "paid" ?
                <span className="text-success text-uppercase"><b>{status}</b></span>
                : <span className="text-danger text-uppercase"><b>{status}</b></span>
            }
          </div>
        ),
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
      <div >
        <Row>
          <Col xs="12" sm="6" md="6">
            <Card className="card-accent-success">
              <CardHeader className="text-success">
                <b>Total Paid</b>
              </CardHeader>
              <CardBody>
                <h1 className="text-center text-success">
                  ₹ {totalPaid.toLocaleString() || 0}
                </h1>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card className="card-accent-danger">
              <CardHeader className="text-danger">
                <b>Remain To Pay</b>
              </CardHeader>
              <CardBody>
                <h1 className="text-center text-danger">
                  ₹ {totalRamain.toLocaleString() || 0}
                </h1>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="card">
          {loading ? <Loader/> : null}
          <CardHeader>
            <strong>Employees Salary List</strong>
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
                        onChange={(e)=>this.getSearchResult(e.target.value)}
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
              <SalaryFilter
                yearValue={yearValue}
                totalMonths={totalMonths}
                collapse={collapse}
                field={field}
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
        </div>
      </div>
    )
  }

}


const mapStateToProps = (state) => {
  return {
    token: state
  }
};

export default connect(mapStateToProps)(SalaryList)


