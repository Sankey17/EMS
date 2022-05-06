import React from "react"
import {Button, Card, CardBody, CardHeader, Col, Form, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap"
import {Formik} from "formik"
import {toast} from "react-toastify";
import {connect} from 'react-redux'
import {initialValues, validate, validationSchema} from "../../Validation/Profile"
import {findEmployeeEmail, updateProfile, uploadImage} from "../../../actions";
import userPic from "../../../assets/img/download.png";
import {Loader} from "../../../globalutilities";


class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: {},
      id: this.props.token.auth._id,
      pic: userPic,
      loading:false
    };
  }

  componentDidMount =  () => {
    const {id} = this.state;
    this.setState({loading:true},async()=>{
      const res = await findEmployeeEmail(id);
      if (res && res.data && res.data.length) {
        Object.keys(initialValues).forEach(f => {
          initialValues[f] = res.data[0][f]
        });
        this.setState({...res.data[0], pic: res.data[0].photo || userPic,loading:false})
      }else{
        this.setState({loading:false})
      }
    })

  };



  onImageChange = async (event) => {
    const data = event
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

  onSubmit = async (values, {setSubmitting, setErrors}) => {
    const res = await updateProfile(values._id, values);
    if (res && res.data) {
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

  cancle = () => {
    this.props.history.push("/profile")
  };

  render() {
    const {pic,loading} = this.state;
    return (
      <div className="animated fadeIn">
        <CardHeader>
          <strong>Profile</strong>
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
                  <Col lg="6">
                    <Form onSubmit={handleSubmit} noValidate name="simpleForm">
                      <Row>
                        <FormGroup className="col-md-6">
                          <Label for="firstName">User Name</Label>
                          <Input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="username"
                            required
                            autoComplete="given-name"
                            valid={!errors.username}
                            invalid={touched.username && !!errors.username}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.username}
                          />
                          <FormFeedback>{errors.username}</FormFeedback>
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className="col-md-6">
                          <Label for="email">Email</Label>
                          <Input
                            type="text"
                            name="userEmailId"
                            id="userEmailId"
                            placeholder="Email ID"
                            required
                            valid={!errors.userEmailId}
                            invalid={touched.userEmailId && !!errors.userEmailId}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.userEmailId}
                          />
                          <FormFeedback>{errors.userEmailId}</FormFeedback>
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className="col-md-6">
                          <label htmlFor="phone">Phone</label>
                          <Input
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder="phone"
                            required
                            valid={!errors.phone}
                            invalid={touched.phone && !!errors.phone}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.phone}
                          />
                          <FormFeedback>{errors.phone}</FormFeedback>
                        </FormGroup>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <div className="form-group">
                              <div className="maxl">
                                Gender : <input type="radio"
                                                value="male"
                                                onChange={handleChange}
                                                checked={values.gender === "male"}
                                                name="gender"
                              /> Male
                                <input type="radio"
                                       value="female"
                                       onChange={handleChange}
                                       checked={values.gender === "female"}
                                       name="gender"
                                /> Female
                                <br/>
                                <span className="invalid">{errors.gender}</span>
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row><br/>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <Label for="dateOfBirth">Country</Label>
                            <Input
                              type="text"
                              name="country"
                              id="country"
                              placeholder="Country"
                              required
                              valid={!errors.country}
                              invalid={touched.country && !!errors.country}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.country}
                            />
                            <FormFeedback>{errors.country}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label for="dateOfBirth">State</Label>
                            <Input
                              type="text"
                              name="state"
                              id="state"
                              placeholder="state"
                              required
                              valid={!errors.state}
                              invalid={touched.state && !!errors.state}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.state}
                            />
                            <FormFeedback>{errors.state}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label for="dateOfBirth">City</Label>
                            <Input
                              type="text"
                              name="city"
                              id="city"
                              placeholder="city"
                              required
                              valid={!errors.city}
                              invalid={touched.city && !!errors.city}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.city}
                            />
                            <FormFeedback>{errors.city}</FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                      <br/>
                      <FormGroup>
                        <Button
                          color="primary"
                          className="mr-1" onClick={this.submit}>Submit</Button>
                        <Button
                          color="danger"
                          className="mr-1" onClick={this.cancle}>Cancle</Button>
                      </FormGroup>
                    </Form>
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


export default connect(mapStateToProps)(EditProfile);
