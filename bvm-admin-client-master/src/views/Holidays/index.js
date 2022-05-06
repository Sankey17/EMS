import React, { Component } from "react";
import { Button } from 'reactstrap';
import moment from "moment";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Table } from "antd";

import { createAndUpdateHoliday, getHolidays, removeHoliday } from "../../actions";
import { HolidayModal } from "../Modal";

class Holidays extends Component {
  state = {
    statusReport: "",
    loading: true,
    reportLoading: false,
    holidays: [],
    page: 1,
    totalHolidays: 0,
    todayTimestamp: 0,
    pages: 0,
    pageSize: 10,
    employees: [],
    isModal: false,
    details: {},
    errors: {}
  };

  componentWillMount() {
    this.fetchHolidays()
  }

  fetchHolidays = async () => {
    const { page, pageSize } = this.state;
    const result = await getHolidays(page - 1, pageSize);
    if (result.success) {
      this.setState({
        loading: false,
        holidays: result.holidays || [],
        page: result.page + 1,
        totalHolidays: result.totalHolidays,
        pages: result.pages,
        employees: result.employees || []
      })
    }
  };

  onPageChange = (page) => {
    this.setState({
      page
    }, () => this.fetchHolidays())
  };

  onShowSizeChange = (current, pageSize) => {
    this.setState({
      pageSize
    })
  }

  handleModal = () => {
    this.setState(prevState => ({
      isModal: !prevState.isModal
    }))
  }

  onSubmit = async () => {
    let { details } = this.state
    details.date = moment(details.date, "YYYY-MM-DD").unix()
    if (!details.date || !details.title) {
      const errors = {
        date: !details.date ? "Please enter holiday date" : "",
        title: !details.title ? "Please enter holiday title" : ""
      }
      this.setState({
        errors
      })
      return
    }
    const res = await createAndUpdateHoliday(details)
    if (res.success) {
      toast.success("Changes submitted successfully", {
        position: toast.POSITION.TOP_RIGHT
      })
      this.fetchHolidays()
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    this.setState({
      isModal: false,
      details: {},
      errors: {}
    })
  }

  onChange = (e) => {
    this.setState({
      details: {
        ...this.state.details,
        [e.target.name]: e.target.value
      }
    })
  }

  onRemove = async (record) => {
    if (window.confirm(`Are you sure you want to delete "${record.title}" ?`)) {
      const res = await removeHoliday(record._id)
      if (res.success) {
        toast.success(res.message, {
          position: toast.POSITION.TOP_RIGHT
        })
        this.fetchHolidays()
      } else {
        toast.error(res.message, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    }
  }

  render() {
    const { holidays, isModal, totalHolidays, pageSize, page, details, errors } = this.state;
    const { user } = this.props

    const columns = [
      {
        title: 'Title',
        key: 'title',
        render: (record) => (
          <span>{record.title}</span>
        ),
        sorter: (a, b) => a.title.length - b.title.length,
      },
      {
        title: 'Holiday Date',
        key: "date",
        render: (record) => (
          <span>{moment.unix(record.date).format("DD-MM-YYYY") || ""}</span>
        ),
        sorter: (a, b) => a.date.length - b.date.length,

      },
      {
        title: 'Day',
        key: "day",
        dataIndex: 'day',
        sorter: (a, b) => a.day.length - b.day.length,
      }
    ];

    if (user && user.role === "admin") {
      columns.push({
        title: 'Action',
        key: 'action',
        render: (record) => {
          return (
            <div>
              <Button size="sm" className="btn-danger btn-brand mr-1 mb-1"
                onClick={() => this.onRemove(record)}>
                <i className="fa fa-trash-o" /><span>Remove</span>
              </Button>
            </div>
          )
        },
      })
    }

    return (
      <div>
        {
          user && user.role === "admin" ?
            <div className="text-right">
              <Button block color="primary" className="btn-success btn-pill w-auto float-right pointer" onClick={this.handleModal}>
                <i className="fa fa-plus fa-lg" />
                &nbsp;&nbsp;
                Add Holiday
              </Button>
              <br />
              <br />
            </div>
            : null
        }
        <HolidayModal
          show={isModal}
          handleClose={this.handleModal}
          onSubmit={this.onSubmit}
          details={details}
          errors={errors}
          onChange={this.onChange}
        />
        <Table
          rowKey={record => record._id}
          pagination={{
            current: page,
            total: totalHolidays,
            defaultPageSize: pageSize,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            onChange: this.onPageChange,
            pageSizeOptions: ['10', '20', '30']
          }}
          columns={columns}
          dataSource={holidays} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth || {}
  }
};

export default connect(mapStateToProps)(Holidays);
