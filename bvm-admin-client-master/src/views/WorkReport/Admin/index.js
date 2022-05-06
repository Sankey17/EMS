import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Loader} from "../../../globalutilities";
import {Select, Table} from "antd";
import {CSVLink} from "react-csv";
import {AiFillCloseCircle, VscDash, BiSearchAlt, GoDesktopDownload} from 'react-icons/all';
import moment from "moment";
import {getUserList, getWorkReportAdmin} from "../../../actions";
import './index.scss';

const AdminWorkReport = (props) => {

  const getTotalWorkingDay = (month = moment().format('M'), year = moment().format('YYYY')) => {
    const totalDay = moment(month + ' ' + year, 'M YYYY').daysInMonth();
    let totalWeekendDay = 0;
    for (let i = 1; i <= totalDay; i++) {
      if (moment(i + ' ' + month + ' ' + year, 'D M YYYY').weekday() === 0 || moment(i + ' ' + month + ' ' + year, 'D M YYYY').weekday() === 6) {
        totalWeekendDay++
      }
    }
    return (totalDay - totalWeekendDay)
  };

  const initialReUseAbleData = {
    month: moment().format("M"),
    year: moment().format("YYYY"),
    totalDay: moment().daysInMonth(),
    totalWorkingDay: getTotalWorkingDay()
  };

  const HalfDay = <p className={'halfDay'} key={'halfDay'}>H</p>;
  const FullDay = <p className={'fullDay'} key={'fullDay'}>F</p>;
  const Absent = <AiFillCloseCircle className={'absent'} key={'absent'}/>;
  const Weekend = <VscDash key={'weekend'}/>;
  const Years = [];
  for (let i = 2015; i <= moment().year(); i++) {
    Years.push(i)
  }

  const [lord, setLord] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [reUseAbleData, setReuseAbleData] = useState(initialReUseAbleData);
  const [userList, setUserList] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [csvData, setCsvData] = useState([]);

  const setTableColumns = () => {
    const predictableData = [];
    for (let i = 1; i <= reUseAbleData.totalDay; i++) {
      predictableData.push({title: i, key: i, dataIndex: i})
    }
    predictableData.unshift({title: "User Name", key: 'userName', dataIndex: "userName"});
    predictableData.push({title: "Total Working Day", key: 'totalWorkingDay', dataIndex: "totalWorkingDay"});
    setColumns(predictableData);
  };

  const setData = (data, filterDate) => {
    let predictDataSource = [];
    let predictCSVDataSource = [];

    data.forEach(row => {
      let newData = {key: row._id, userName: row.fullName};
      let newCSVData = {key: row._id, userName: row.fullName};

      let workingDay = 0;
      row.workreport.forEach(obj => {
        const day = moment(obj.date, 'L').format('D');
        newData[day] = obj.attendType === 'Full day' ? FullDay : obj.attendType === 'Half day' ? HalfDay : null
        newCSVData[day] = obj.attendType === 'Full day' ? "F" : obj.attendType === 'Half day' ? "H" : null
      });
      for (let i = 1; i <= filterDate.totalDay; i++) {
        if (moment(i + " " + filterDate.month + " " + filterDate.year, 'DD M YYYY').weekday() === 0 || moment(i + " " + filterDate.month + " " + filterDate.year, 'D M YYYY').weekday() === 6) {
          newData[i] = Weekend;
          newCSVData[i] = "W";
        }

        workingDay += newData[i] === FullDay ? 1 : newData[i] === HalfDay ? 0.5 : 0;
        newData[i] = newData[i] ? newData[i] : Absent;
        newCSVData[i] = newCSVData[i] ? newCSVData[i] : "A";
      }
      newData.totalWorkingDay = workingDay;
      newCSVData.totalWorkingDay = workingDay;

      predictDataSource.push(newData);
      predictCSVDataSource.push(newCSVData);
    });
    setDataSource(predictDataSource);
    setCsvData(predictCSVDataSource);
  };

  const setFilterOption = async () => {
    const totalUser = await getUserList();
    setUserList(() => totalUser.data)
  };

  const getData = async () => {
    const data = await getWorkReportAdmin();
    data && data.data && setData(data.data, reUseAbleData)
  };

  const setUI = async () => {
    setLord(true);
    setTableColumns();
    await setFilterOption();
    await getData();
    setLord(false)
  };

  const searchClickHandler = async (e) => {
    setLord(true);
    e.preventDefault();
    let {user, month, year} = filterData;
    const data = await getWorkReportAdmin(user, month, year);
    if (!year) year = moment().format('YYYY');
    if (!month) month = moment().format('M');
    if (data && data.data) {
      setReuseAbleData({
        ...reUseAbleData,
        month: month,
        year,
        totalDay: moment(month + ' ' + year, 'M YYYY').daysInMonth(),
        totalWorkingDay: getTotalWorkingDay(month, year)
      });
      let filterDate = {month: month, year: year, totalDay: moment(month + ' ' + year, 'M YYYY').daysInMonth()};
      setData(data.data, filterDate);
      setLord(false)
    }
  };

  const setFilter = (key, value) => {
    setFilterData({...filterData, [key]: value})
  };

  useEffect(() => {
    setUI();
  }, [props.token.auth]);

  useEffect(() => {
    setTableColumns();
  }, [reUseAbleData]);

  return (
    <div className={'d-flex flex-column'} style={{gap: '1rem'}}>
      {lord ? <Loader/> : null}
      <form className={'form-row'}>
        <div className={'from-group col-md-5'}>
          <label>User</label>
          <Select mode="multiple" allowClear placeholder="User" onChange={value => setFilter('user', value)}>
            {userList.map(user => <Select.Option value={user._id} key={user._id}>{user.userName}</Select.Option>)}
          </Select>
        </div>
        <div className={'from-group col-md-3'}>
          <label>Month</label>
          <Select allowClear placeholder="Month" onChange={value => setFilter('month', value + 1)}>
            {moment.months().map((month, index) => <Select.Option value={index} key={index}>{month}</Select.Option>)}
          </Select>
        </div>
        <div className={'from-group col-md-3'}>
          <label>Year</label>
          <Select allowClear placeholder="Year" onChange={value => setFilter('year', value)}>
            {Years.map(year => <Select.Option value={year} key={year}>{year}</Select.Option>)}
          </Select>
        </div>
        <div className={'from-group col-md-1'} style={{display: "flex", justifyContent: 'flex-end'}}>
          <button className={'btn btn-success rounded-circle search'} onClick={searchClickHandler}>
            <BiSearchAlt/>
          </button>
        </div>
      </form>
      <div className={'d-flex justify-content-between align-items-center'}>
        <div>
          <h2>{moment(reUseAbleData.month, 'M').format('MMMM') + ' ' + reUseAbleData.year}</h2>
          <h6>Total Working Day : {reUseAbleData.totalWorkingDay}</h6>
        </div>
        <div>
          <CSVLink data={csvData}>
            <button className={'btn btn-success search'}>
              <GoDesktopDownload/>
            </button>
          </CSVLink>
        </div>
      </div>
      <Table columns={columns} dataSource={dataSource}> </Table>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    token: state
  }
};

export default connect(mapStateToProps)(AdminWorkReport);
