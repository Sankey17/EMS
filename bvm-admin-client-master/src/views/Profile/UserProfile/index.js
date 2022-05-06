import React from "react";
import {connect} from 'react-redux'
import BankInformation from "../../BankInformation";
import {Button, Card, CardBody, CardHeader, Col, Form, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {Formik} from "formik";
import {toast} from "react-toastify";
import {findEmployeeEmail, updateProfile, uploadImage} from "../../../actions"
import userpic from '../../../assets/img/download.png'
import {initialValues, validate, validationSchema} from '../../Validation/details'
import {qualificationValue, designationValue, Loader} from '../../../globalutilities'

let moment = require('moment');


class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      loading:false,
      pic: userpic,
      id: this.props.token.auth._id,
      imageUrl: {},
      Name: "",

    };
  }

  async componentDidMount() {
    const {id} = this.state;
    this.setState({loading: true}, async () => {
      const res = await findEmployeeEmail(id);
      if (res && res.data && res.data.length) {
        const data = res.data[0];
        this.setState({data: res.data[0], pic: res.data[0].photo || userpic});
        Object.keys(initialValues).forEach(f => {
          initialValues[f] = data[f]
        });
        initialValues.dateOfBirth = moment(res.data[0].dateOfBirth).format('YYYY-MM-DD');
        initialValues.dateOfJoin = moment(res.data[0].dateOfJoin).format('YYYY-MM-DD');
        this.setState({list: res.data[0], Name: "Profile", loading: false})
      } else {
        this.setState({loading: false})
      }
    })
  };

  onImageChange = async (event) => {
    const data = event;
    const res = await uploadImage(data);
    if (res && res.data && res.data.photo) {
      initialValues.photo = res.data.photo;
      this.setState({pic: res.data.photo})
    } else {
      toast.error(`image is not uploaded!`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }

  };
  onSubmit = async (values) => {
    let {data} = this.state;
    values.id = data._id;
    const res = await updateProfile(values.id, values);
    if (res && res.data) {
      Object.keys(initialValues).forEach(f => {
        initialValues[f] = ""
      });
      toast.success(`Your Profile is Updated successfully!`, {
        position: toast.POSITION.TOP_RIGHT
      });
      this.props.history.push('/profile')
    } else {
      toast.error("Something went wrong!", {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  };

  render() {
    const {pic, loading, id} = this.state;
    console.log(id)
    return (
      <div className="animated fadeIn">
        <CardHeader>
          <strong>{this.state.Name}</strong>
        </CardHeader>
        {loading ? <Loader/> : null}
        <Card>
          <Row>
            <img src={pic} onClick={(e) => this.upload.click()} style={{
              margin: "23px 0px 2px 38px",
              borderStyle: "solid"
            }} alt="profile" width="120px"/>
            <input id="myInput" type="file" ref={(ref) => this.upload = ref}
                   onChange={this.onImageChange} style={{display: 'none'}}/>
          </Row>
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
                    <Form onSubmit={handleSubmit} noValidate name="simpleForm">
                      <Row>
                        <FormGroup className="col-md-6">
                          <Label for="firstName">First Name</Label>
                          <Input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="First Name"
                            autoComplete="given-name"
                            valid={!errors.firstName}
                            invalid={touched.firstName && !!errors.firstName}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.firstName}
                          />
                          <FormFeedback>{errors.firstName}</FormFeedback>
                        </FormGroup>
                        <FormGroup className="col-md-6">
                          <Label for="lastName">Last Name</Label>
                          <Input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Last Name"
                            autoComplete="family-name"
                            valid={!errors.lastName}
                            invalid={touched.lastName && !!errors.lastName}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.lastName}
                          />
                          <FormFeedback>{errors.lastName}</FormFeedback>
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className="col-md-6">
                          <Label for="email">Email</Label>
                          <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            autoComplete="email"
                            valid={!errors.email}
                            invalid={touched.email && !!errors.email}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                          />
                          <FormFeedback>{errors.email}</FormFeedback>
                        </FormGroup>
                        <FormGroup className="col-md-6">
                          <label htmlFor="phone">Phone</label>
                          <Input
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder="Phone"
                            autoComplete="phone"
                            valid={!errors.phone}
                            invalid={touched.phone && !!errors.phone}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone}
                          />
                          <FormFeedback>{errors.phone}</FormFeedback>
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className="col-md-6">
                          <Label for="dateOfBirth">Date of Birth</Label>
                          <Input
                            type="date"
                            id="dateOfBirth"
                            required
                            valid={!errors.dateOfBirth}
                            value={values.dateOfBirth}
                            invalid={touched.dateOfBirth && !!errors.dateOfBirth}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <FormFeedback>{errors.dateOfBirth}</FormFeedback>
                        </FormGroup>
                        <FormGroup className="col-md-6">
                          <Label for="dateOfBirth">Date of Join</Label>
                          <Input
                            type="date"
                            id="dateOfJoin"
                            required
                            valid={!errors.dateOfJoin}
                            value={values.dateOfJoin}
                            invalid={touched.dateOfJoin && !!errors.dateOfJoin}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <FormFeedback>{errors.dateOfJoin}</FormFeedback>
                        </FormGroup>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="designation">Designation</Label>
                            <select className="form-control"
                                    name="designation"
                                    value={values.designation}
                                    id="designation"
                                    required
                                    onChange={handleChange}>
                              <option value="">Select Designation</option>
                              {
                                designationValue.map((value, index) => {
                                  return (
                                    <option key={index} value={value}>{value}</option>
                                  )
                                })
                              }
                            </select>
                            <span className="invalid">{errors.designation}</span>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="qualification">Qulification</Label>
                            <select className="form-control"
                                    name="qualification"
                                    value={values.qualification}
                                    id="qualification"
                                    required
                                    onChange={handleChange}>
                              <option value="">Select Qualification</option>
                              {
                                qualificationValue.map((value, index) => {
                                  return (
                                    <option key={index} value={value}>{value}</option>
                                  )
                                })
                              }
                            </select>
                            <span className="invalid">{errors.qualification}</span>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <FormGroup className="col-md-6">
                          Gender : <input
                          type="radio"
                          className="pointer"
                          name="gender"
                          value="male"
                          checked={values.gender === "male"}
                          onChange={handleChange}
                          id="gender"
                          required
                        />Male
                          <input
                            type="radio"
                            className="pointer"
                            name="gender"
                            value="female"
                            checked={values.gender === "female"}
                            onChange={handleChange}
                            id="gender"
                            required
                          />Female
                          <br/>
                          <span className="invalid pb-3">{errors.gender}</span>
                        </FormGroup>

                      </Row>
                      <FormGroup>
                        <Label for="address">Address</Label>
                        <Input
                          type="textarea"
                          id="streetAddress"
                          required
                          placeholder="Street Address"
                          valid={!errors.streetAddress}
                          invalid={touched.streetAddress && !!errors.streetAddress}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.streetAddress}
                        />
                        <FormFeedback>{errors.streetAddress}</FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Input
                              type="text"
                              id="city"
                              required
                              valid={!errors.city}
                              placeholder="City"
                              invalid={touched.city && !!errors.city}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.city}
                            />
                            <FormFeedback>{errors.city}</FormFeedback>
                          </Col>
                          <Col>
                            <Input
                              type="text"
                              id="state"
                              required
                              valid={!errors.state}
                              placeholder="State"
                              invalid={touched.state && !!errors.state}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.state}
                            />
                            <FormFeedback>{errors.state}</FormFeedback>
                          </Col>
                        </Row>
                      </FormGroup>
                      <Row>
                        <FormGroup className="col-md-6">
                          <Input
                            type="text"
                            id="pincode"
                            required
                            valid={!errors.pincode}
                            placeholder="Pincode"
                            invalid={touched.pincode && !!errors.pincode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.pincode}
                          />
                          <FormFeedback>{errors.pincode}</FormFeedback>
                        </FormGroup>
                      </Row>
                      <FormGroup>
                        <Button type="submit" color="primary"
                                className="mr-1">{isSubmitting ? "Wait..." : "Submit"}</Button>
                        <Button type="reset" color="danger" className="mr-1" onClick={handleReset}>Reset</Button>
                      </FormGroup>
                    </Form>
                  </Col>
                  <Col md={1}/>
                  <Col md={4}>
                    <BankInformation _id={id}/>
                  </Col>
                </Row>
              )}
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state
  }
};

export default connect(mapStateToProps)(UserProfile);
