import React, { Component } from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import { Col, Row } from 'reactstrap';

import Stopwatch from "./StopWatch";
import BreakWatch from "./BreakWatch";
import LunchWatch from "./LunchWatch";

import {
  getTimeInfo,
  updateWatch,
  getAllMovementByYear,
} from "../../actions";
import {setDateFormat} from "../../utils/CONST";
import {ColumnChart} from "./ColumnChart";
import {CalenderChart} from "./CalenderChart";
import Reports from "./Reports";
import BirthdayBash from "./BirthdayBash";

import "./dashboard.css";

class Dashboard extends Component {
  state = {
    loading: true,
    lunchStart: false,
    breakStart: false,
    workStart: false,
    todayTimestamp: 0,
    currentlyInProgress: {},
    selectedDate: moment(new Date()).format("YYYY-MM-DD"),
    years: [
     2017,2018,2019
    ],
    year: null,
    dayData:  [
      ['Genre', "On Demand", "Lunch", "Mindset", { role: 'annotation' } ]
    ],
    data: [
      [{ type: 'date', id: 'Date' }, { type: 'number', id: 'Hours' }, {type: 'string', role: 'tooltip' }]
    ]
  };

  async componentWillMount() {
    const today = setDateFormat(new Date());
    const todayTimestamp = moment(today, "MM-DD-YYYY").unix()
    const result = await getTimeInfo(todayTimestamp)
    const res = (result && result.data) || {};
    this.setState({
      lunchStart: res.lunchStart|| false,
      breakStart: res.breakStart || false,
      workStart: res.workStart || false,
      currentlyInProgress: res,
      loading: false,
      todayTimestamp,
      year: moment(new Date()).format("YYYY")
    })
    this.setChartView()
    this.setDayChartView(res)
  }

  setChartView = async () => {
    const {data, year} = this.state
    data.splice(1, data.length)
    let i;
    const movements = await getAllMovementByYear(year)
    // console.log(movements)
    if(movements.success && movements.data && movements.data.length){
      for (i = 0; i < movements.data.length; i++) {
        const { workTime, date, year, month, day} = movements.data[i]
        if(movements.data && movements.data[i] && movements.data[i].date){
          const workingTime =  workTime || 0
          const workingDate =  moment.unix(date).format("LL");

          const seconds = ("0" + (Math.floor(workingTime / 1000) % 60)).slice(-2);
          const minutes = ("0" + (Math.floor(workingTime / 60000) % 60)).slice(-2) || 0;
          const hours = ("0" + Math.floor(workingTime / 3600000)).slice(-2) || 0;

          data.push([new Date(year, month-1, day), Number(`${hours}.${minutes}` || 0), `${workingDate} \n Hours: ${`${hours}:${minutes}:${seconds}`} \n`])
        }
      }
      this.setState({
        data
      })
    }
  }

  setDayChartView = (result) => {
    const {dayData, selectedDate} = this.state
    const { workTime, lunchTime, breakTime } = result

    const workMinutes = ("0" + (Math.floor(workTime / 60000) % 60)).slice(-2);
    const workHours = ("0" + Math.floor(workTime / 3600000)).slice(-2);

    const lunchMinutes = ("0" + (Math.floor(lunchTime / 60000) % 60)).slice(-2);
    const lunchHours = ("0" + Math.floor(lunchTime / 3600000)).slice(-2);

    const breakMinutes = ("0" + (Math.floor(breakTime / 60000) % 60)).slice(-2);
    const breakHours = ("0" + Math.floor(breakTime / 3600000)).slice(-2);

    dayData.splice(1, dayData.length)
    dayData.push([
      moment(selectedDate).format("LL"),
      Number(`${workHours}.${workMinutes}` || 0),
      Number(`${lunchHours}.${lunchMinutes}` || 0),
      Number(`${breakHours}.${breakMinutes}` || 0), ""
    ])
    this.setState({
      dayData
    })
  }

  submitWatch = async (key, status) => {
    const { employeeCode, firstName, lastName } = this.props.auth
    const employeeName = `${firstName} ${lastName}`
    const { todayTimestamp, breakStart, lunchStart, workStart, currentlyInProgress} = this.state

    const payload = {
      employeeCode,
      employeeName,
      date: todayTimestamp,
      breakStart, lunchStart, workStart
    }
    /*if(status === "start"){
      payload.watchStartTime = Date.now()
    }else {
      payload.watchStartTime = 0
      if(key === "workStart" && !workStart){
        payload.workTime = (currentlyInProgress.workTime || 0) + (Date.now() - currentlyInProgress.watchStartTime)
      }
      if(key === "lunchStart" && !lunchStart){
        payload.lunchTime = (currentlyInProgress.lunchTime || 0) + (Date.now() - currentlyInProgress.watchStartTime)
      }
      if(key === "breakStart" && !breakStart){
        payload.breakTime = (currentlyInProgress.breakTime || 0) + (Date.now() - currentlyInProgress.watchStartTime)
      }
    }*/
    const result = await updateWatch(payload, status, key)
    if(result.success){
      console.log(result.data)
      this.setState({
        currentlyInProgress: result.data || {}
      })
    }else {
      this.setState({
        [key]: false
      })
    }
  }

  onStart = (key) => {
    this.setState({
      [key]: true
    },() => this.submitWatch(key, "start"))
  }

  onStop = (key) => {
    this.setState({
      [key]: false
    },() => this.submitWatch(key, "stop"))
  }

  handleYear = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    }, () => this.setChartView())
  }

  handleDateSelection = async (e) => {
    const { name, value } = e.target
    let timestamp = null

    if(value){
      timestamp = moment(value, "YYYY-MM-DD").unix()
    }else {
      const today = setDateFormat(new Date());
      timestamp = moment(today, "MM-DD-YYYY").unix()
    }
    const result = await getTimeInfo(timestamp)
    const res = (result && result.data) || {};

    this.setState({
      [name]:  moment.unix(timestamp).format("YYYY-MM-DD")
    }, () => this.setDayChartView(res))
  }

  render() {
    const {  currentlyInProgress, loading, breakStart, lunchStart, workStart, years, year, selectedDate } = this.state
    const stopEvent = workStart || (!breakStart && !lunchStart && !workStart)
    const lunchEvent = lunchStart || (!breakStart && !lunchStart && !workStart)
    const breakEvent = breakStart || (!breakStart && !lunchStart && !workStart)

    if(loading){
      return <p>Loading...</p>
    }
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center text-center">
          <Col md="4" style={{pointerEvents: stopEvent ? "unSet" : "none", opacity: stopEvent ? 1 : 0.65 }}>
            <Stopwatch
              lunchStart={lunchStart}
              workStart={workStart}
              currentlyInProgress={currentlyInProgress}
              onStart={() => this.onStart("workStart")}
              onStop={() => this.onStop("workStart")}
            />
          </Col>
          <Col md="4" style={{pointerEvents: lunchEvent ? "unSet" : "none", opacity: lunchEvent ? 1 : 0.65}}>
            <LunchWatch
              lunchStart={lunchStart}
              currentlyInProgress={currentlyInProgress}
              onStart={() => this.onStart("lunchStart")}
              onStop={() => this.onStop("lunchStart")}
            />
          </Col>
          <Col md="4" style={{pointerEvents: breakEvent ? "unSet" : "none", opacity: breakEvent ? 1 : 0.65}}>
            <BreakWatch
              breakStart={breakStart}
              currentlyInProgress={currentlyInProgress}
              onStart={() => this.onStart("breakStart")}
              onStop={() => this.onStop("breakStart")}
            />
          </Col>
        </Row>
        <br/>
        <Row className="justify-content-center text-center box">
          <ColumnChart
            selectedDate={selectedDate || ""}
            handleDateSelection={this.handleDateSelection}
            dayData={this.state.dayData}
          />
          <Col md={8} style={{ overflowX: "auto", overflowY: "hidden" }}>
            <CalenderChart
              years={years}
              year={year}
              handleYear={this.handleYear}
              data={this.state.data}
            />
            <BirthdayBash/>
          </Col>
        </Row>
        <br/>
        <Reports />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: (state && state.auth) || {}
  }
};

export default connect(mapStateToProps)(Dashboard)

