import React, {Component} from 'react'
import moment from 'moment'
import {Table} from 'antd';

import { Loader } from "../../globalutilities";
import {getAllLeaveDetails} from '../../actions'

class UserViewLeaveList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      length: "",
      loading:false,
      list: [],
      searchString: "",
      searchStatus: "",
    }
  }

  componentDidMount =  () => {
    this.getLeaveList()
  };

  getLeaveList =  () => {
    const {searchStatus, searchString} = this.state
    this.setState({
      loading:true
    },async ()=>{
      const res = await getAllLeaveDetails({
        status: searchStatus,
        searchString
      });
      console.log(res.data)
      this.setState({
        list: (res && res.data) || [],
        length: (res && res.data.length) || 0,
        loading: false
      })
    })
  };

  render() {
    const {list, length} = this.state;
    const columns = [
      {
        title: 'No',
        key: 'basic.js',
        render: (record, data, index) => (
          <span>{index + 1}</span>
        ), sorter: (a, b) => (a.length > b.length) ? 1 : ((b.length > a.length) ? -1 : 0)
      },
      {
        title: 'Date from ',
        key: "leaveDateTo",
        render: (record) => (
          <span>{moment(record.leaveDateTo).format('DD/MM/YYYY')}</span>
        ),
        sorter: (a, b) => a.leaveDateTo.length - b.leaveDateTo.length,

      },
      {
        title: 'Date to',
        key: "leaveDateFrom",
        render: (record) => (
          <span>{moment(record.leaveDateFrom).format('DD/MM/YYYY')}</span>
        ),
        sorter: (a, b) => a.leaveDateFrom.length - b.leaveDateFrom.length,

      },
      {
        title: 'Reason',
        key: "leaveReason",
        dataIndex: 'leaveReason',
        sorter: (a, b) => a.leaveReason.length - b.leaveReason.length,

      },
      {
        title: 'Aproved/Decline By',
        key: "updatedBy",
        dataIndex: 'updatedBy',
        sorter: (a, b) => a.updatedBy.length - b.updatedBy.length,

      },
      {
        title: 'Status',
        key: "leaveStatus",
        dataIndex: 'leaveStatus',
        sorter: (a, b) => a.leaveStatus.length - b.leaveStatus.length,
        render: (leaveStatus) => (
          <div>
            {
              leaveStatus === "approved" ?
                <span className="text-success text-uppercase"><b>{leaveStatus}</b></span>
                : leaveStatus === "declined" ?
                <span className="text-danger text-uppercase"><b>{leaveStatus}</b></span>
                : <span className="text-primary text-uppercase"><b>{leaveStatus}</b></span>
            }
          </div>
        ),
      },
    ];
    return (
      <div>
        {this.state.loading ? <Loader/> : null}
        <Table
          rowKey={record => record._id}
          pagination={{
            defaultCurrent: 1,
            total: length,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30']
          }} columns={columns} dataSource={list}/>
      </div>
    )
  }
}

export default UserViewLeaveList
