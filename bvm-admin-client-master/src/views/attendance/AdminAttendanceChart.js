import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {FormGroup, Input, Label, Row, Table} from 'reactstrap';
import {getAttendanceChart, manuallyUpdateWatch} from "../../actions";
import {Loader} from "../../globalutilities"
import Avatar from "../../assets/img/avatars/avatar.png"
import HoursModal from "./HoursModal"

class AdminAttendanceChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      presentDay: moment(new Date()).format("DD"),
      presentYear: moment(new Date()).format("YYYY"),
      presentMonth: moment(new Date()).format("MM"),
      listOfDate: [],
      loading: false,
      result: {},
      show: false,
      id: "",
      searchMonth: moment(new Date()).format("YYYY-MM"),
      modelData: {}
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true
    }, async () => {
      this.getAttendance()
    })
  }

  getAttendance = async () => {
    const search = this.state.searchMonth.split("-");
    const year = parseInt(search[0]);
    const month = parseInt(search[1]);
    if (year && month) {
      const lastDateOfMonth = moment(new Date(year, month, 0)).format("DD");
      const days = [];
      for (let i = 1; i <= parseInt(lastDateOfMonth); i++) {
        days.push({year, month, day: i});
      }
      const result = await getAttendanceChart(year, month);
      this.setState({
        loading: false,
        result: (result && result.data) || {},
        listOfDate: days,
      })
    }
  };

  displayDetails = async (attend) => {
    if (attend) {
      this.setState({
        modelData: attend,
        show: true
      })
    }
  };


  handleClose = () => this.setState({show: false, modelData: {}});

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    }, () => this.getAttendance())
  };

  onChangeModal = (e) => {
    this.setState({
      modelData: {
        ...this.state.modelData,
        [e.target.name]: e.target.value
      }
    })
  }

  onWatchUpdate = async () => {
    const { _id, workTime, lunchTime, breakTime } = this.state.modelData
    const result = await manuallyUpdateWatch({
      _id,
      workTime: Number(workTime) || 0,
      lunchTime: Number(lunchTime) || 0,
      breakTime: Number(breakTime) || 0
    })
    if(result && result.success){
      this.handleClose()
      this.getAttendance()
    }
  }

  render() {
    const {listOfDate, searchMonth, result, presentDay, presentMonth, presentYear, loading, show, modelData} = this.state;
    return (
      <div>
        <Row>
          <FormGroup className="col-md-3">
            <Label for="searchMonth">Select Month</Label>
            <Input
              type="month"
              id="searchMonth"
              name="searchMonth"
              value={searchMonth}
              max={moment(new Date()).format("YYYY-MM")}
              onChange={this.handleChange}
            />
          </FormGroup>
        </Row>
        {loading ? <Loader/> : null}
        <HoursModal
          show={show}
          modelData={modelData}
          handleClose={this.handleClose}
          onSubmit={this.onWatchUpdate}
          onChange={this.onChangeModal}
        />

        <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
          <thead className="thead-light">
          <tr>
            <th className="text-center"><i className="icon-people"/></th>
            {
              listOfDate.map((date, index) => (
                <th key={index}>{date.day}</th>
              ))
            }
          </tr>
          </thead>
          <tbody>
          {
            result && result.employees ?
              result.employees.map((emp, i) => {
                return (
                  <tr key={i}>
                    <td className="text-center">
                      <div className="avatar">
                        <img src={emp.photo || Avatar} className="img-avatar" alt="avatar"/>
                      </div>
                      <div>{emp.firstName} {emp.lastName}</div>
                      <div className="small text-muted">
                        <span>{emp.designation}</span>
                      </div>
                    </td>
                    {
                      listOfDate.map((date, index) => {
                        const isAvailable = result.attendances.find(attend => emp._id === attend.employeeId && attend.day === parseInt(date.day) && attend.month === parseInt(date.month) && attend.year === parseInt(date.year));
                        const mapDate = new Date(date.year, date.month - 1, parseInt(date.day)); //Year, Month, Date
                        const presentDate = new Date(presentYear, presentMonth - 1, presentDay); //Year, Month, Date
                        if (mapDate > presentDate) {
                          return <td key={index}/>
                        }
                        if (isAvailable) {
                          return (
                            <td key={index}>
                              <span className="text-success">
                                <i
                                  className="fa fa-check fa-lg mt-4 pointer"
                                  onClick={() => this.displayDetails(isAvailable)}
                                />
                              </span>
                            </td>
                          )
                        }
                        return <td key={index}><span className="text-danger"><i
                          className="fa fa-close fa-lg mt-4"/></span></td>
                      })
                    }
                  </tr>
                )
              })
              : null
          }
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state
  };
};

export default connect(mapStateToProps)(AdminAttendanceChart);


