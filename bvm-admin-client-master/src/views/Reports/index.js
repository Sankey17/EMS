import React, { Component } from "react";
import { Col } from "reactstrap";
import moment from "moment";
import { fetchEmployeeReports } from "../../actions";
import { Table, Input } from "antd";

const { Search } = Input;

class Reports extends Component {
  state = {
    statusReport: "",
    loading: true,
    reportLoading: false,
    reports: [],
    page: 1,
    totalReports: 0,
    todayTimestamp: 0,
    pages: 0,
    pageSize: 10,
    employees: [],
    searchName: [],
    searching: 0,
  };

  componentWillMount() {
    this.fetchReports();
  }

  fetchReports = async () => {
    const { page, pageSize } = this.state;
    const result = await fetchEmployeeReports(page - 1, pageSize);
    if (result.success) {
      this.setState({
        loading: false,
        reports: result.reports || [],
        page: result.page + 1,
        totalReports: result.totalReports,
        pages: result.pages,
        employees: result.employees || [],
      });
    }
  };

  onPageChange = (page) => {
    this.setState(
      {
        page,
      },
      () => this.fetchReports()
    );
  };

  onShowSizeChange = (current, pageSize) => {
    this.setState({
      pageSize,
    });
  };

  onNameSearch = (searchText) => {
    this.setState({
      searching: 1,
    });
    this.state.reports.map((val) => {
      this.state.employees.map((emp) => {
        if (val.employeeId === emp._id) {
          val.Name = emp.firstName + emp.lastName;
        }
      });
    });

    const filteredEvents = this.state.reports.filter((val) => {
      return val.Name.includes(searchText);
    });

    this.setState({
      searchName: filteredEvents,
    });
  };

  onDateSearch = (searchText) => {
    this.setState({
      searching: 1,
    });
    this.state.reports.map((val) => {
      val.formtDate = moment.unix(val.date).format("DD-MM-YYYY");
    });

    const filteredEvents = this.state.reports.filter((val) => {
      return val.formtDate.includes(searchText);
    });

    this.setState({
      searchName: filteredEvents,
    });
  };

  render() {
    const {
      reports,
      employees,
      totalReports,
      pageSize,
      page,
      searchName,
      searching,
    } = this.state;

    const columns = [
      {
        title: "Date",
        key: "date",
        render: (record) => (
          <span>{moment.unix(record.date).format("DD-MM-YYYY") || ""}</span>
        ),
        sorter: (a, b) => a.date.length - b.date.length,
      },
      {
        title: "Name",
        key: "employeeId",
        render: (record) => {
          const employee = employees.find(
            (emp) => emp._id === record.employeeId
          );
          return (
            <span>
              {(employee && employee.firstName) || ""}
              {(employee && employee.lastName) || ""}
            </span>
          );
        },
      },
      {
        title: "Report",
        key: "report",
        dataIndex: "report",
        width: "70%",
        render: (record) => (
          <span dangerouslySetInnerHTML={{ __html: record }} />
        ),

        // render: (record) => htmlToText(record),
        // render: (record) => <span>{record.replace(/<[^>]+>/g, "")}</span>,

        sorter: (a, b) => a.report.length - b.report.length,
      },
    ];

    return (
      <Col md={12}>
        <div className="mb-3 text-right">
          <Search
            placeholder="Search by date"
            onSearch={this.onDateSearch}
            className="mr-4"
            style={{ width: 200 }}
          />
          <Search
            placeholder="Search by name"
            onSearch={this.onNameSearch}
            style={{ width: 200 }}
          />
        </div>
        <Table
          rowKey={(record) => record._id}
          pagination={{
            current: page,
            total: totalReports,
            defaultPageSize: pageSize,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            onChange: this.onPageChange,
            pageSizeOptions: ["10", "20", "30"],
          }}
          columns={columns}
          dataSource={searching === 1 ? searchName : reports}
        />
      </Col>
    );
  }
}

export default Reports;
