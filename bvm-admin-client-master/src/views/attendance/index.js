import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {Table} from "antd";
import {getAttendanceData} from "../../actions";
import {Loader} from "../../globalutilities"

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeCode: this.props.auth.auth.employeeCode || "",
      loading: false
    };
  }


  async componentWillMount() {
    await this.getData()
  }

  getData =()=>{
    const {employeeCode} = this.state;
    this.setState({
      loading: true
    }, async () => {
      const res = await getAttendanceData(employeeCode);
      if (res && res.data) {
        let data = [];
        if (res && res.data && res.data.length) {
          for (let i = 0; i < res.data.length; i++) {
            const {workTime, lunchTime, breakTime, date} = res.data[i];
            if (res.data && res.data[i] && res.data[i].date) {
              const workingTime = workTime || 0;
              const lunchingTime = lunchTime || 0;
              const breakingTime = breakTime || 0;
              const workminutes = ("0" + (Math.floor(workingTime / 60000) % 60)).slice(-2) || 0;
              const workhours = ("0" + Math.floor(workingTime / 3600000)).slice(-2) || 0;
              const lunchminutes = ("0" + (Math.floor(lunchingTime / 60000) % 60)).slice(-2) || 0;
              const lunchhours = ("0" + Math.floor(lunchingTime / 3600000)).slice(-2) || 0;
              const breakminutes = ("0" + (Math.floor(breakingTime / 60000) % 60)).slice(-2) || 0;
              const breakhours = ("0" + Math.floor(breakingTime / 3600000)).slice(-2) || 0;
              data.push({
                date: moment.unix(date).format("DD/MM/YYYY"),
                WorkHours: Number(`${workhours}.${workminutes}` || 0) + " hrs",
                lunchHours: Number(`${lunchhours}.${lunchminutes}` || 0) + " hrs",
                breakHours: Number(`${breakhours}.${breakminutes}` || 0) + " hrs"
              })
            }
          }
          this.setState({attendanceData: data, loading: false})
        }else{
          this.setState({loading: false})
        }
      } else {
        this.setState({loading: false})
      }
    })
  }

  render() {
    const {length, attendanceData, loading} = this.state;
    const columns = [
      {
        title: '#',
        key: 'no',
        render: (record, data, index) => (
          <span>{index + 1}</span>
        ), sorter: (a, b) => (a.length > b.length) ? 1 : ((b.length > a.length) ? -1 : 0)
      },
      {
        title: "Date",
        key: "date",
        render: record => (
          <span>{record.date}</span>
        ),
      },
      {
        title: "Work-Hours",
        key: "WorkHours",
        dataIndex: "WorkHours",
        sorter: (a, b) => a.WorkHours.length - b.WorkHours.length
      },
      {
        title: "Lunch-Hours",
        key: "lunchHours",
        dataIndex: "lunchHours",
        sorter: (a, b) => a.lunchHours.length - b.lunchHours.length
      },
      {
        title: "Break-Hours",
        key: "breakHours",
        dataIndex: "breakHours",
        sorter: (a, b) => a.breakHours.length - b.breakHours.length
      },
    ];

    return (
      <div>
        {loading ? <Loader/> : null}
        <Table
          rowKey={(record, index) => index}
          pagination={{
            defaultCurrent: 1,
            total: length,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30"]
          }}
          columns={columns}
          dataSource={attendanceData}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state
  };
};

export default connect(mapStateToProps)(Attendance);


