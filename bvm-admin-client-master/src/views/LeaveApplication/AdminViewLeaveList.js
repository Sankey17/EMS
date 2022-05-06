import React, {Component} from "react";
import {CardBody, CardHeader, Col, Input, Row, Button, Card} from "reactstrap";
import {Table} from "antd";
import {connect} from 'react-redux'
import moment from 'moment'
import {LeaveUpdateModal} from "../Modal/index"
import {getAllLeaveDetails, leaveUpdate} from '../../actions'
import {Loader} from "../../globalutilities";

class AdminViewLeaveList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.token.auth.username || "",
      id: this.props.token.auth._id || "",
      list: [],
      leaveList: [],
      loading: false,
      show: false,
      length: "",
      index: "",
      status: "",
      searchString: "",
      searchStatus: "pending",
      statusList: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "declined", label: "Declined" }
      ]
    }
  }

  getLeaveList =  () => {
    const {searchStatus, searchString} = this.state
    this.setState({
      loading:true
    },async ()=>{
      const res = await getAllLeaveDetails({
        status: searchStatus,
        searchString
      });
      this.setState({
        leaveList: (res && res.data) || [],
        loading: false
      })
    })
  };

  async componentDidMount() {
    this.getLeaveList()
  }

  handleClose = () => this.setState({show: false});

  handleStatus = (index, status) => {
    this.setState({
      show: true,
      index,
      status
    })
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    }, () => this.getLeaveList())
  };

  updateStatus = async () => {
    let leaveStatus;
    const {leaveList, index, status,name} = this.state;
    if (status === "Approve") {
      leaveStatus = "approved";
    } else {
      leaveStatus = "declined";
    }
    const res = await leaveUpdate({
      leaveStatus, _id: leaveList[index]._id,updatedBy:name
    });
    if (res) {
      await this.getLeaveList()
    }
    this.setState({show: false, index: "", status: ""})
  };

  cancel = async () => {
    this.setState({show: false})
  };

  render() {
    const {leaveList, show,loading, status, searchStatus, searchString, statusList} = this.state;
    const approvedLeave = (leaveList && leaveList.filter(leave => leave.leaveStatus === "approved")) || []
    const declinedLeave = (leaveList && leaveList.filter(leave => leave.leaveStatus === "declined")) || []
    const pendingLeave = (leaveList && leaveList.filter(leave => leave.leaveStatus === "pending")) || []
    const columns = [
      {
        title: 'Employee Code',
        key: 'employeeCode',
        dataIndex: 'employeeCode',
        sorter: (a, b) => a.employeeCode.length - b.employeeCode.length
      },
      {
        title: 'Name',
        dataIndex: 'employeeName',
        key: 'employeeName',
        sorter: (a, b) => a.employeeName.length - b.employeeName.length,
      },
      {
        title: 'Date from ',
        key: "leaveDateFrom",
        render: (record) => (
          <span>{moment(record.leaveDateFrom).format('DD/MM/YYYY')}</span>
        ),
        sorter: (a, b) => a.leaveDateFrom.length - b.leaveDateFrom.length,

      },
      {
        title: 'Date to',
        key: "leaveDateTo",
        render: (record) => (
          <span>{moment(record.leaveDateTo).format('DD/MM/YYYY')}</span>
        ),
        sorter: (a, b) => a.leaveDateTo.length - b.leaveDateTo.length,

      },
      {
        title: 'No of Days',
        key: 'no',
        render: (record) => (
          <span>{moment(record.leaveDateTo).format('DD')-moment(record.leaveDateFrom).format('DD')}</span>
        ),
      },
      {
        title: 'Reason',
        key: 'leaveReason',
        dataIndex: 'leaveReason',
        width: '30%',
        sorter: (a, b) => a.leaveReason.length - b.leaveReason.length,
      },
      {
        title: 'Status',
        key: 'leaveStatus',
        dataIndex: 'leaveStatus',
        sorter: (a, b) => (a.leaveStatus > b.leaveStatus) ? 1 : ((b.leaveStatus > a.leaveStatus) ? -1 : 0),
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
      {
        title: 'Action',
        key: 'action',
        dataIndex: 'leaveStatus',
        render: (record, data, index) => {
          if(record !== "pending"){
            return null
          }
          return (
            <div>
              <Button size="sm" className="btn-success btn-brand mr-1 mb-1"
                      onClick={() => this.handleStatus(index, "Approve")}>
                <i className="fa fa-check-circle-o"/><span>Approve</span>
              </Button>
              <Button size="sm" className="btn-danger btn-brand mr-1 mb-1"
                      onClick={() => this.handleStatus(index, "Decline")}>
                <i className="fa fa-times-circle-o"/><span>Decline</span>
              </Button>
            </div>
          )
        },
      },
    ];

    return (
      <div>
        <Row>
          <Col xs="12" sm="6" md="4">
            <Card className="card-accent-success">
              <CardHeader className="text-success">
                <b>Approved Leave</b>
              </CardHeader>
              <CardBody>
                <h2 className="text-center text-success">
                  {approvedLeave.length || 0}
                </h2>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="4" md="4">
            <Card className="card-accent-danger">
              <CardHeader className="text-danger">
                <b>Declined Leave</b>
              </CardHeader>
              <CardBody>
                <h2 className="text-center text-danger">
                  {declinedLeave.length || 0}
                </h2>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="4" md="4">
            <Card className="card-accent-primary">
              <CardHeader className="text-primary">
                <b>Pending Leave</b>
              </CardHeader>
              <CardBody>
                <h2 className="text-center text-primary">
                  {pendingLeave.length || 0}
                </h2>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="card">
          <CardHeader>
            <strong>Leave List</strong>
          </CardHeader>
          {loading ? <Loader/> : null}
          <CardBody>
            <div className="card-body">
              <Row>
                <Col lg="12">
                  <Row>
                    <Col md="9" xs="5">
                      <Input type="text"
                             id="search"
                             name="searchString"
                             value={searchString}
                             placeholder="Search Name"
                             onChange={this.onChange}/>
                    </Col>
                    <Col md="3" xs="3">
                      <select className="form-control"
                              name="searchStatus"
                              value={searchStatus}
                              id="searchStatus"
                              required
                              onChange={this.onChange}>
                        <option value="">All</option>
                        {
                          statusList.map((opt, index) => {
                            return (
                              <option key={index} value={opt.value}>{opt.label}</option>
                            )
                          })
                        }
                      </select>
                    </Col>
                  </Row>
                </Col>
              </Row><br/>
              <LeaveUpdateModal
                show={show}
                status={status}
                handleClose={this.handleClose}
                updateStatus={this.updateStatus}
                cancel={this.cancel}
              />
              <Row className="table-responsive">
                <Table
                  rowKey={record => record.LeaveId}
                  pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '30']
                  }} columns={columns} dataSource={leaveList}/>
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

export default connect(mapStateToProps)(AdminViewLeaveList);
