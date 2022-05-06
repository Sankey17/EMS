import React from "react";
import {connect} from 'react-redux'
import {toast} from "react-toastify"
import {Formik} from "formik";
import {CardBody, Button, Input, CardHeader, Label, FormGroup, FormFeedback, Row, Form, Card, Col} from "reactstrap";
import {initialValues, validate, validationSchema} from "../Validation/application";
import {leaveFormPost} from '../../actions'
import {Loader} from "../../globalutilities";

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.token.auth._id || "",
      reason: '',
      ReasonError: "",
      loading:false,
      dateofBirth: '',
      dobError: '',
      date: "",
      date1: "",
      reasonValues: ["Annual leave", 'bereavement', 'Maternity leave', 'others', 'Sick leave', 'Unpaid leave', 'Parental leave'],
      leaveType: "",
      leaveTypeError: "",
      leaveOfDay: "",
      otherLeaveData: {},

    }
  }

  onSubmit = async (values, {setSubmitting, setErrors}) => {
    debugger
    const {otherLeaveData} = this.state;
    const data = {
      leaveDateFrom: values.from,
      leaveDateTo: values.to,
      leaveReason: values.reason,
      leaveStatus: "pending",
      type: otherLeaveData.type,
      typeOfDay: otherLeaveData.typeOfDay,
      hours: otherLeaveData.hour,
      otherReason: otherLeaveData.otherReason,
      updatedBy: "no one",
    };
    const res = await leaveFormPost(data);
    if (res) {
      toast.success(`Your leave submitted successfully!`, {
        position: toast.POSITION.TOP_RIGHT
      });
      this.props.history.push("/leaveapplication/total-leave-list")
    }
  };


  onInputChange = (e) => {
    const {name, value} = e.target;
    this.setState({
      otherLeaveData: {
        ...this.state.otherLeaveData, [name]: value
      }
    })
  };


  render() {
    const {reasonValues, otherLeaveData, leaveTypeError,loading} = this.state;
    return (
      <div style={{marginRight: "100"}}>
        <div className="animated fadeIn">
          {loading ? <Loader/> : null}
          <CardHeader>
            <strong>Leave Request Form</strong>
          </CardHeader>
          <Card>
            <CardBody>
              <Formik
                initialValues={initialValues}
                validate={validate(validationSchema)}
                onSubmit={this.onSubmit}
                render={({
                           values,
                           errors,
                           touched,
                           status,
                           dirty,
                           handleChange,
                           handleBlur,
                           handleSubmit,
                           isSubmitting,
                           isValid,
                           handleReset,
                           setTouched
                         }) => (
                  <Row>
                    <Col md={6}>
                      <Form
                        onSubmit={handleSubmit}
                        noValidate
                        name="simpleForm"
                      >
                        <Row>
                          <FormGroup className="col-md-6">
                            <Label for="firstName">Date</Label>
                            <Input
                              type="date"
                              id="date"
                              required
                              valid={!errors.date}
                              value={values.date}
                              invalid={
                                touched.date && !!errors.date
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <FormFeedback>{errors.date}</FormFeedback>
                          </FormGroup>
                        </Row>
                        <Row>
                          <FormGroup row>
                            <FormGroup className="col-md-12">
                              <Col md="12">
                                <Label>Reason for Requested leave:(please tick appropriate box)</Label>
                              </Col>
                              <Col md="12">
                                {
                                  reasonValues.map((v, i) => (
                                    <FormGroup check key={i} className="radio">
                                      <Input className="form-check-input" type="radio" id="leave" name="type"
                                             value={v} onChange={this.onInputChange}/>
                                      <Label className="form-check-label" check htmlFor="inline-radio1">{v}</Label>
                                    </FormGroup>
                                  ))
                                }

                              </Col>
                            </FormGroup>
                          </FormGroup>
                        </Row>
                        {otherLeaveData && otherLeaveData.type === "others" ?
                          <Row>
                            <Col md={12}>
                              <FormGroup>
                                <Label for="designation">Another Reason</Label>
                                <Input
                                  type="text"
                                  name="otherReason"
                                  onChange={this.onInputChange}
                                />
                                <FormFeedback>{}</FormFeedback>
                              </FormGroup>
                            </Col>
                          </Row>
                          : null}
                        <Row>
                          <FormGroup row>
                            <FormGroup className="col-md-12">
                              <Col md="12">
                                <Label>Leave:</Label>
                              </Col>
                              <Col md="12">
                                <FormGroup check inline>
                                  <Input className="form-check-input" type="radio" id="leave" name="typeOfDay"
                                         value="full" onChange={this.onInputChange}/>
                                  <Label className="form-check-label" check htmlFor="inline-radio1">Full</Label>
                                </FormGroup>
                                <FormGroup check inline>
                                  <Input className="form-check-input" type="radio" id="leave" name="typeOfDay"
                                         value="half" onChange={this.onInputChange}/>
                                  <Label className="form-check-label" check htmlFor="inline-radio2">Half</Label>
                                </FormGroup>
                                <FormGroup check inline>
                                  <Input className="form-check-input" type="radio" id="leave" name="typeOfDay"
                                         value="other" onChange={this.onInputChange}/>
                                  <Label className="form-check-label" check htmlFor="inline-radio3">other</Label>
                                </FormGroup>
                              </Col>
                            </FormGroup>
                          </FormGroup>
                        </Row>
                        {otherLeaveData && otherLeaveData.typeOfDay === "half" ?
                          <Row>
                            <Col md={4}>
                              <FormGroup>
                                <Label for="designation">Number of Hours</Label>
                                <Input
                                  type="number"
                                  name="hour"
                                  onChange={this.onInputChange}
                                />
                                <span className="invalid">
                                {leaveTypeError}
                              </span>
                              </FormGroup>
                            </Col>
                          </Row>
                          : null}
                        {otherLeaveData && otherLeaveData.typeOfDay === "other" ?
                          <Row>
                            <Col md={4}>
                              <FormGroup>
                                <Label for="designation">Number of Hours</Label>
                                <Input
                                  type="number"
                                  name="hour"
                                  onChange={this.onInputChange}
                                />
                                <span className="invalid">
                                {leaveTypeError}
                              </span>
                              </FormGroup>
                            </Col>
                          </Row>
                          : null}
                        <Row>
                          <FormGroup className="col-md-6">
                            <Label for="dateOfBirth">From</Label>
                            <Input
                              type="date"
                              id="from"
                              required
                              valid={!errors.from}
                              value={values.from}
                              invalid={
                                touched.from && !!errors.from
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <FormFeedback>{errors.from}</FormFeedback>
                          </FormGroup>
                          <FormGroup className="col-md-6">
                            <Label for="dateOfBirth">to</Label>
                            <Input
                              type="date"
                              id="to"
                              required
                              valid={!errors.to}
                              value={values.to}
                              invalid={
                                touched.to && !!errors.to
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <FormFeedback>{errors.to}</FormFeedback>
                          </FormGroup>
                        </Row>
                        <Row>
                          <FormGroup className="col-md-6">
                            <Label for="email">Notes/Comment:</Label>
                            <Input
                              type="textarea"
                              name="reason"
                              id="reason"
                              placeholder="reason"
                              autoComplete="reason"
                              valid={!errors.reason}
                              invalid={touched.reason && !!errors.reason}
                              required
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.reason}
                            />
                            <FormFeedback>{errors.reason}</FormFeedback>
                          </FormGroup>
                        </Row>
                        <FormGroup>
                          <Button
                            type="submit"
                            color="primary"
                            className="mr-1"
                          >
                            {isSubmitting ? "Wait..." : "Submit"}
                          </Button>
                          <Button
                            type="reset"
                            color="danger"
                            className="mr-1"
                            onClick={handleReset}
                          >
                            Reset
                          </Button>
                        </FormGroup>
                      </Form>
                    </Col>
                  </Row>
                )}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state
  }
};
export default connect(mapStateToProps)(Application);

