import React, {Component} from "react";
import {DropdownList} from "react-widgets";
import moment from 'moment'
import "react-widgets/dist/css/react-widgets.css";
import {Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Label} from "reactstrap";
import {checkSalaryDetails, getEmployee, paidSalary} from "../../actions";
import {Loader,totalMonths} from "../../globalutilities"
import {getBankInfo} from "../../actions/bankInformation";

class Salary extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      searchValue: "",
      employeeList: [],
      firstName: "",
      salary: 20000,
      list: [],
      monthValue: '',
      disabled: true,
      yearValue: "",
      monthDisabled: true,
      disableMonths: [],
      loading:false,
      yearDisable: [],
      totalYear: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      enable: false,
      employeeId: "",
      month: "",
      status: "paid"
    };
  }


  componentDidMount = async () => {
    const {totalYear} = this.state;
    const year = moment(new Date()).format('YYYY');
    const yearDis = totalYear.filter(v => v > year);
    this.setState({loading:true},async ()=>{
      const res = await getEmployee({status: "active"});
      if (res && res.data && res.data.length) {
        this.setState({
          list: res.data,
          yearDisable: yearDis,
          employeeList: res.data.map(d => d.firstName),
          loading:false
        });
      }else{
        this.setState({loading:false})
      }
    })

  };

  onSelectYear = (yearValue) => {
    const thisYear = moment(new Date()).format('YYYY');
    const month = moment(new Date()).format('MM');
    if (yearValue === thisYear) {
      const totalDisableMonth = totalMonths.filter((v, i) => i >= month);
      this.setState({disableMonths: totalDisableMonth})
    } else {
      this.setState({
        yearValue,
        monthDisabled: false,
        firstName: '',
        id: '',
        salary: "",
        searchValue: "",
        monthValue: '',
        disableMonths: []
      })
    }
    this.setState({yearValue})
  };

  onSelectMonth = (monthValue) => {
    const {yearValue} = this.state;
    if (yearValue) {
      const selectedMonth = totalMonths.findIndex(v => v === monthValue);
      this.setState({
        disabled: false,
        monthValue: monthValue,
        firstName: '',
        id: '',
        salary: "",
        searchValue: "",
        employeeId: "",
        bankName: "",
        bankAccountNo: "",
        ifscCode:"",
        panNo:"",
        month: selectedMonth
      })
    }
  };

  onSearchChange = (searchValue) => {
    const {list, yearValue, monthValue} = this.state;
    this.setState({searchValue: searchValue});
    const filter = list.filter(v => v.firstName === searchValue);
    const id = filter[0]._id;
    this.getBankInformation(id);
    if (yearValue && monthValue) {
      this.setState({
          firstName: filter[0].firstName.concat(` ${filter[0].lastName}`),
          salary: 20000,
          employeeId: filter[0].employeeCode
        }, () => {
          this.checkSalaryDetails()
        },
      )
    }
  };

  getBankInformation = async ( id ) =>{
    const bankInfo = await getBankInfo(id);
    if(bankInfo && (bankInfo.length > 0))
    {
      const {bankName, bankAccountNo, ifscCode, panNo} = bankInfo[0];
      this.setState({ bankName, bankAccountNo, ifscCode, panNo})
    }
    else {
      this.setState({ bankName:"", bankAccountNo:"", ifscCode:"", panNo:""})
    }
  }

  checkSalaryDetails =  () => {
    const {yearValue, employeeId, month} = this.state;
    const data = {yearValue, employeeId, month};
    this.setState({loading:true},async ()=>{
      const findUser = await checkSalaryDetails(data);
      if (findUser && findUser.data === true) {
        this.setState({enable: false,loading:false})
      } else {
        this.setState({enable: true,loading:false})
      }
    })

  };

  onPaidSalary = async () => {
    const {firstName, yearValue, employeeId, month, salary, status} = this.state;
    const send = {firstName, employeeId, status, salary, month, year: yearValue};
    const res = await paidSalary(send);
    if (res && res.data) {
      alert("your salary paid Successfully");
      this.setState({enable: false})
    }
  };

  render() {
    let {
      searchValue, enable, employeeList, firstName, salary, yearDisable,
      monthValue, disabled, disableMonths, yearValue, totalYear, employeeId,loading, bankName, bankAccountNo, ifscCode ,panNo
    } = this.state;
    return (
      <Card>
        <CardHeader>
          <strong>Salary</strong>
        </CardHeader>
        {loading ? <Loader/> : null}
        <CardBody>
          <Form className="form-horizontal">
            <FormGroup row>
              <Col md="2">
                <Label>Select year</Label>
              </Col>
              <Col xs="12" md="4">
                <DropdownList
                  defaultValue="Please select the year"
                  data={totalYear}
                  yearValue={yearValue}
                  onChange={this.onSelectYear}
                  textField="month"
                  disabled={yearDisable}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="2">
                <Label>Select Month</Label>
              </Col>
              <Col xs="12" md="4">
                <DropdownList
                  data={totalMonths}
                  defaultValue="Please select the month"
                  monthValue={monthValue}
                  onChange={this.onSelectMonth}
                  textField="month"
                  disabled={disableMonths}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="2">
                <Label>Search</Label>
              </Col>
              <Col xs="12" md="4">
                <DropdownList
                  filter
                  data={employeeList}
                  searchValue={searchValue}
                  defaultValue="Please select the name"
                  allowCreate="onFilter"
                  onChange={(searchValue) => this.onSearchChange(searchValue)}
                  textField="name"
                  disabled={disabled}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="2">
                <Label htmlFor="Id">Employee Code</Label>
              </Col>
              <Col xs="12" md="4">
                <p className="form-control-static">{employeeId}</p>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="2">
                <Label htmlFor="Name">Name</Label>
              </Col>
              <Col xs="12" md="4">
                <p className="form-control-static">{firstName}</p>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="2">
                <Label htmlFor="Salary">Salary</Label>
              </Col>
              <Col xs="12" md="4">
                <p className="form-control-static">{salary}</p>
              </Col>
            </FormGroup>
             <hr/>
             <p><b>Bank Information</b></p>
             <hr/>
            <FormGroup row>
              <Col md="2">
                <Label htmlFor="Salary">Bank Name</Label>
              </Col>
              <Col xs="12" md="4">
                <p className="form-control-static">{bankName}</p>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="2">
                <Label htmlFor="Salary">Bank Account No</Label>
              </Col>
              <Col xs="12" md="4">
                <p className="form-control-static">{bankAccountNo}</p>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="2">
                <Label htmlFor="Salary">IFSC Code</Label>
              </Col>
              <Col xs="12" md="4">
                <p className="form-control-static">{ifscCode}</p>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="2">
                <Label htmlFor="Salary">Pan No</Label>
              </Col>
              <Col xs="12" md="4">
                <p className="form-control-static">{panNo}</p>
              </Col>
            </FormGroup>
          </Form>
        </CardBody>
        {/*<Button onClick={this.pdf} >PDF</Button>*/}
        {enable ?
          <CardFooter>
            <Button type="submit" size="sm" color="primary" onClick={this.onPaidSalary}>
              <i className="fa fa-dot-circle-o"/> Submit
            </Button>
            <Button type="reset" size="sm" color="danger">
              <i className="fa fa-ban"/> Reset
            </Button>
          </CardFooter>
          : <div/>
        }
      </Card>
    )
  }

}

export default Salary;
