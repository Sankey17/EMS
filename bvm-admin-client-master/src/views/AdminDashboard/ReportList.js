import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardHeader,
  Col,
} from "reactstrap";
import moment from "moment";
import { fetchEmployeeReports } from "../../actions/index";
import { REPORT_PAGE_LIMIT } from "../../utils/CONST";

class ReportList extends Component {
  state = {
    statusReport: "",
    loading: true,
    reportLoading: false,
    reports: [],
    page: 0,
    limit: REPORT_PAGE_LIMIT,
    totalReports: 0,
    todayTimestamp: 0,
    pages: 0,
  };

  componentWillMount() {
    this.fetchReports();
  }

  fetchReports = async () => {
    const { page } = this.state;
    const result = await fetchEmployeeReports(page);
    if (result.success) {
      this.setState({
        loading: false,
        reports: result.reports || [],
        page: result.page,
        limit: result.limit,
        totalReports: result.totalReports,
        pages: result.pages,
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

  setPageNumbers = (pageNumber) => {
    if (pageNumber > 4) {
      return pageNumber;
    }
    return 0;
  };

  setPagination = () => {
    const { page, pages } = this.state;
    const nums = [];
    for (let i = 0; i < pages; i++) {
      nums.push(i);
    }
    return (
      <ButtonToolbar>
        <ButtonGroup className="mr-2">
          {page > 0 ? (
            <Button
              className="bg-danger"
              active={false}
              onClick={() => this.onPageChange(page - 1)}
              disabled={false}
            >
              <i className="fa fa-lg fa-angle-double-left" />
            </Button>
          ) : null}
          {pages
            ? nums.splice(this.setPageNumbers(page, pages), 5).map((item) => (
                <Button
                  key={item.toString()}
                  active={page === item}
                  onClick={() => this.onPageChange(item)}
                >
                  {item + 1}
                </Button>
              ))
            : null}
          {pages > 5 && pages - 1 !== page ? (
            <Button
              className="bg-info"
              active={false}
              onClick={() => this.onPageChange(page + 1)}
              disabled={false}
            >
              <i className="fa fa-lg fa-angle-double-right" />
            </Button>
          ) : null}
        </ButtonGroup>
      </ButtonToolbar>
    );
  };

  render() {
    const { reports } = this.state;

    return (
      <Col md={12}>
        <Card className="border-primary">
          <CardHeader className="text-center">
            <b>Previous reports</b>
          </CardHeader>
          <CardBody>
            {reports.map((item, index) => (
              <Card key={index} className="card-accent-info">
                <CardHeader>
                  <b>
                    {(item.date &&
                      moment.unix(item.date).format("DD-MM-YYYY")) ||
                      ""}
                  </b>
                </CardHeader>
                <CardBody className="report-body">{item.report}</CardBody>
              </Card>
            ))}
            <div className="text-right">{this.setPagination()}</div>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default ReportList;
