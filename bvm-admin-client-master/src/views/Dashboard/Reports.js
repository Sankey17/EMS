import React, { Component } from "react";
import { toast } from "react-toastify";
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  FormGroup,
  Label,
} from "reactstrap";
import LaddaButton, { ZOOM_OUT } from "react-ladda";
import moment from "moment";
import { fetchEmployeeReports, submitEmployeeReport } from "../../actions";
import {
  ToastTimeout,
  REPORT_PAGE_LIMIT,
  setDateFormat,
} from "../../utils/CONST";
import CKEditor from "ckeditor4-react";

class Reports extends Component {
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
    const today = setDateFormat(new Date());
    const todayTimestamp = moment(today, "MM-DD-YYYY").unix();
    this.setState({
      todayTimestamp,
    });
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

  // onChange = (e) => {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   });
  // };

  onChangeBtn = (e) => {
    this.setState({
      statusReport: e.editor.getData(),
    });
  };

  onSubmitReport = () => {
    const { statusReport, todayTimestamp } = this.state;

    this.setState(
      {
        reportLoading: true,
      },
      async () => {
        const result = await submitEmployeeReport({
          date: todayTimestamp,
          report: statusReport,
        });
        if (result.success) {
          toast("Report submitted successfully", {
            autoClose: ToastTimeout,
            type: toast.TYPE.SUCCESS,
          });
          this.setState(
            {
              reports: result.result || [],
              reportLoading: false,
            },
            () => this.fetchReports()
          );
        } else {
          toast(result.message, {
            autoClose: ToastTimeout,
            type: toast.TYPE.ERROR,
          });
          this.setState({
            reportLoading: false,
          });
        }
      }
    );
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
    const { reportLoading, reports, todayTimestamp } = this.state;
    const isTodayReport = reports.find(
      (report) => (report.date = todayTimestamp)
    );
    return (
      <Row className="box">
        {isTodayReport ? (
          <Col md={6}>
            <Alert color="success">
              <h3>Your today's report submitted.</h3>
            </Alert>
          </Col>
        ) : (
          <Col md={6}>
            <FormGroup>
              <Label for="firstName">
                <b>Today's status report</b>
              </Label>

              <CKEditor name="statusReport" onChange={this.onChangeBtn} />

              {/* <Input
                type="textarea"
                name="statusReport"
                id="statusReport"
                placeholder="Today's report"
                autoComplete="given-name"
                required
                rows={8}
                onChange={this.onChange}
                value={statusReport}
              /> */}
              {/*<p style={{color:"red"}}>{ReasonError}</p>*/}
            </FormGroup>
            <FormGroup>
              <LaddaButton
                className="btn btn-primary btn-ladda mr-1"
                loading={reportLoading}
                onClick={this.onSubmitReport}
                data-color="red"
                data-style={ZOOM_OUT}
              >
                Submit
              </LaddaButton>
            </FormGroup>
          </Col>
        )}
        <Col md={6}>
          {reports.map((item, index) => (
            <Card key={index} className="card-accent-info">
              <CardHeader>
                <b>
                  {(item.date && moment.unix(item.date).format("DD-MM-YYYY")) ||
                    ""}
                </b>
              </CardHeader>
              <CardBody
                className="report-body"
                dangerouslySetInnerHTML={{ __html: item.report }}
              >
                {/* {item.report} */}
              </CardBody>
            </Card>
          ))}
          <div className="text-right">{this.setPagination()}</div>
        </Col>
      </Row>
    );
  }
}
export default Reports;
