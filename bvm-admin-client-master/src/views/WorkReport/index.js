import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {DatePicker, Select, Table} from "antd";
import {Loader} from "../../globalutilities";
import Button from "reactstrap/lib/Button";
import {getWorkReportFilter, getUserList, getUserReported, getWorkReport} from "../../actions";

const WorkReport = (props) => {
  const user = props.token.auth

  const columns = [
    {
      title: 'Report Date',
      key: 'reportDate',
      dataIndex: 'reportDate'
    },
    {
      title: 'Project',
      key: 'project',
      dataIndex: 'project'
    },
    {
      title: 'Task',
      key: 'task',
      dataIndex: 'task'
    },
    {
      title: 'Hours',
      key: 'hours',
      dataIndex: 'hours'
    },
    {
      title: 'Minutes',
      key: 'minutes',
      dataIndex: 'minutes'
    },
    {
      title: 'Status',
      kry: 'status',
      dataIndex: 'status'
    },
  ];

  user.role === 'admin' && columns.unshift({
    title: 'User Name',
    key: 'userName',
    dataIndex: 'userName'
  });

  const [dataSource, setDataSource] = useState([]);
  const [lord, setLord] = useState(false);
  const [isReported, setIsReported] = useState(true);
  const [userData, setUserData] = useState([{}]);
  const [userId, setUserId] = useState(undefined);
  const [date, setDate] = useState();

  const setUser = async () => {
    const result = await getUserReported()
    if (result && result.data && result.data.length === 0) {
      setIsReported(false)
    }
  };

  const setAdmin = async () => {
    const userListResponse = await getUserList();
    const userList = userListResponse.data || []
    setUserData(userList)
  }
  const setData = async (result) => {
    const newDataSource = [];
    result && result.data && result.data.forEach(row => {
      const newData = {
        id: row._id,
        reportDate: row.date,
        project: row.project,
        task: row.task,
        hours: row.hours,
        minutes: row.minutes,
        status: row.status,
        userName: row.employeeName
      };
      newDataSource.push(newData)
    });
    setDataSource(newDataSource);
    user.role === "user" && await setUser(newDataSource);
    setLord(false)
  }

  const getData = async () => {
    setLord(true);

    const result = await getWorkReport();

    await setData(result)
  };

  const getWorkReportUserFilter = async (id, date) => {
    setLord(true)
    const result = await getWorkReportFilter(id, date)
    await setData(result)
  }

  const newReportClickHandler = () => {
    props.history.push('/workreportform')
  };

  const onSelectChangeHandler = async e => {
    const newUserId = e.length > 0 ? e : undefined
    setUserId(newUserId)
    await getWorkReportUserFilter(newUserId, date)

  };

  const onDatePickerChangeHandler = async e => {
    const dateFormat = e ? e.format('L') : undefined
    setDate(dateFormat)
    await getWorkReportUserFilter(userId, dateFormat)

  };

  useEffect(() => {
      user.role === "admin" && setAdmin()
      user._id && getData()
    },
    [props.token.auth])

  return (
    <div className={'d-flex flex-column'} style={{gap: '1rem'}}>
      {lord ? <Loader/> : null}
      {user.role === "user" && <div className={'d-flex'} style={{gap: '1rem'}}>
        <Button color="primary" className="btn-success btn-pill pointer" disabled={isReported}
                onClick={newReportClickHandler}>
          <i className="fa fa-plus fa-lg"/>
          &nbsp;&nbsp;
          New Report
        </Button>
      </div>}
      {user.role === 'admin' && <div className={'d-flex'} style={{gap: '1rem'}}>
        <Select
          mode="multiple"
          allowClear
          style={{width: '100%'}}
          placeholder="Please select"
          onChange={onSelectChangeHandler}
        >
          {userData.map(user => <Select.Option value={user._id} key={user._id}>{user.userName}</Select.Option>)}
        </Select>
        <DatePicker onChange={onDatePickerChangeHandler}/>
      </div>}
      <Table dataSource={dataSource} columns={columns} rowKey={data => data.id}/>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    token: state
  }
};

export default connect(mapStateToProps)(WorkReport);
