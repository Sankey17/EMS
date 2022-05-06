import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Input, Table} from 'antd';
import moment from "moment";
import {Collapse, FormGroup, Label, Row, Badge} from "reactstrap";
import {Loader} from "../../globalutilities";
import {getHolidayList, getOnlineEmployeeList, getWorkingTime} from '../../actions'

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.token.auth.emailId || "",
      id: this.props.token.auth._id || "",
      length: "",
      loading: false,
      collapse: false,
      onlineEmployeeList: [],
      selectedName: "",
      todayDate: moment(new Date()).format("DD/MM/YYYY"),
      worksData: [],
      monthHolidays: null,
      searchMonth: moment(new Date()).format("YYYY-MM")
    }
  }


  componentDidMount = async () => {
    await this.onlineEmployeeList();
    await this.employeesWorks()
  };

  onlineEmployeeList = async () => {
    this.setState({loading: true}, async () => {
      const res = await getOnlineEmployeeList();
      if (res && res.data) {
        const {todayDate} = this.state;
        let matchData = [];
        for (let i = 0; i < res.data.length; i++) {
          const {date} = res.data[i];
          const workingDate = moment.unix(date).format("LL");
          const Date = moment(workingDate).format("DD/MM/YYYY");
          if (todayDate === Date) {
            matchData.push(res.data[i]);
            this.setState({onlineEmployeeList: matchData, loading: false})
          } else {
            this.setState({loading: false})
          }
        }
      } else {
        this.setState({loading: false})
      }
    })
  };

  employeesWorks = async () => {
    const search = this.state.searchMonth.split("-");
    const year = parseInt(search[0]);
    const month = parseInt(search[1]);
    const lastDate = moment(new Date(year, month, 0)).format("DD");
    if (year && month) {
      await this.countHolidays({year, month, lastDate});
      await this.countWorkingHours(year, month)
    }
  };

  countHolidays = (data) => {
    this.setState({loading: true}, async () => {
      const res = await getHolidayList(data);
      if (res && res.data) {
        this.setState({
          monthHolidays: res.data.holidays,
          totalHours: (data.lastDate - 4 - res.data.holidays) * 8,
          loading: false
        });
      } else {
        this.setState({loading: false})
      }
    })
  };

  countWorkingHours = async (year, month) => {
    const res = await getWorkingTime({year, month});
    if (res && res.data) {
      this.setState({worksData: res.data}, async () => {
        const worksData = res.data;
        if (worksData && worksData.length) {
          for (let i = 0; i < worksData.length; i++) {
            const {workTime} = worksData[i];
            if (worksData && worksData[i]) {
              const workingTime = workTime || 0;
              const minutes = ("0" + (Math.floor(workingTime / 60000) % 60)).slice(-2) || 0;
              const hours = ("0" + Math.floor(workingTime / 3600000)).slice(-2) || 0;
              worksData[i].hours = Number(`${hours}.${minutes}` || 0)
            }
          }
          this.setState({
            worksData
          })
        }
      })
    }
  };


  offline = async (id, name) => {
    if(window.confirm(`Are you sure?, you want stop ${name} tracker.`)){
      const res = await getOnlineEmployeeList(id);
      if (res && res.data) {
        await this.onlineEmployeeList()
      }
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    }, () => this.employeesWorks())
  };

  render() {
    const {collapse, worksData, loading, onlineEmployeeList, length, searchMonth, totalHours} = this.state;
    const columns1 = [
      {
        title: 'No',
        key: 'no',
        render: (record, data, index) => (
          <span>{index + 1}</span>
        ), sorter: (a, b) => (a.length > b.length) ? 1 : ((b.length > a.length) ? -1 : 0)
      },
      {
        title: "Employee Codes",
        key: "employeeCode",
        dataIndex: "employeeCode",
        sorter: (a, b) => a.employeeCode.length - b.employeeCode.length
      },
      {
        title: "Employee Name",
        key: "employeeName",
        dataIndex: "employeeName",
        sorter: (a, b) => a.employeeName.length - b.employeeName.length
      },
      {
        title: "Status",
        key: "status",
        render: (record) => (
          <span>
             <Badge color={record.workStart
               ? "primary" : record.lunchStart
                 ? "warning" :"info"}>
                 {record.workStart ? "Working" : record.lunchStart ? "In Lunch" : "In Break"}
             </Badge>
          </span>
        )
      },
      {
        title: "Action",
        key: "action",
        render: (record, data) => (
          <span onClick={() => this.offline(data._id, data.employeeName)}>
            <i className="fa fa-ban pointer" style={{color: "red"}}  aria-hidden="true" />
          </span>
        )
      }
    ];
    const columns2 = [
      {
        title: '#',
        key: 'no',
        render: (record, data, index) => (
          <span>{index + 1}</span>
        )
      },
      {
        title: "Employee Name",
        key: "employeeName",
        dataIndex: "employeeName",
        sorter: (a, b) => a.employeeName.length - b.employeeName.length
      },
      {
        title: "Works",
        key: "hours",
        render: record => (
          <span>{record.hours} hrs</span>
        ),
        sorter: (a, b) => a._id.length - b._id.length
      },
    ];
    return (
      <div>
        {loading ? <Loader/> : null}
        <h4 align="center">
          <i className="fa fa-circle fa-1x" style={{color: "green"}} aria-hidden="false"/>
          <span className="text-success text-uppercase"><b> Online Employees</b></span>
        </h4><br/>
        <Table
          rowKey={record => record._id}
          pagination={{
            defaultCurrent: 1, total: length, defaultPageSize: 10, showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30']
          }} columns={columns1}
          dataSource={onlineEmployeeList}
        />
        <br/>
        <div className="card">
          <div className="card-header">
            <Row className="row justify-content-between">
              <FormGroup className="col-md-6">
                <button className="btn btn-link" onClick={() => {
                  this.setState({collapse: !this.state.collapse})
                }}>Employee Work
                </button>
              </FormGroup>
              {collapse
                ?
                <>
                  <FormGroup className="col-md-2">
                    <Label for="searchMonth"><b>Select Month</b></Label>
                    <Input
                      type="month"
                      id="searchMonth"
                      name="searchMonth"
                      value={searchMonth}
                      max={moment(new Date()).format("YYYY-MM")}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup className='col-md-2'>
                    <b>Total-Hours:</b> <span className="text-success text-uppercase"><b>{totalHours}</b></span>
                  </FormGroup>
                </>
                : null}
            </Row>
          </div>
          <div>
            <Collapse isOpen={collapse}>
              <Table
                rowKey={record => record._id}
                pagination={{
                  defaultCurrent: 1, total: length, defaultPageSize: 10, showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '30']
                }} columns={columns2} dataSource={worksData}/>
            </Collapse>
          </div>
        </div>
        <br/><br/>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state
  }
};

export default connect(mapStateToProps)(AdminDashboard)
