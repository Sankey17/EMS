import React from "react";
import {toast} from "react-toastify";
import {Button, Card, CardBody, CardHeader, Col, Form, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {Formik} from "formik";
import moment from "moment";
import {initialValues, validate, validationSchema} from "../../Validation/details";
import userPic from "../../../assets/img/download.png";
import {employeeDetails, getDesignation, getEmployee, uploadImage} from "../../../actions";
import {Loader,qualificationValue} from "../../../globalutilities";

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: userPic,
      loading: false,
      pic: userPic,
      imageUrl: {},
      Name: "",
      searchId: this.props.match.params.id || "",
      length:"",
      designationValue: []
    };
  }

  getEmployeeDetails =  filter => {
    this.setState({loading:true},async ()=>{
      const res = await getEmployee(filter);
      if (res && res.data && res.data.length) {
        const data = res.data[0];
        this.setState({pic: data.photo || userPic });
        Object.keys(initialValues).forEach(f => {
          initialValues[f] = data[f];
        });
        initialValues.dateOfBirth = moment(res.data[0].dateOfBirth).format(
          "YYYY-MM-DD"
        );
        initialValues.dateOfJoin = moment(res.data[0].dateOfJoin).format(
          "YYYY-MM-DD"
        );
        this.setState({Name: "Profile",loading:false});
      }else{
        this.setState({loading:false});
      }
    })

  };

  async componentWillMount() {
    const {searchId} = this.state;
    const designationValue = await getDesignation()
    if (this.props.match.params.id && searchId) {
      await this.getEmployeeDetails({_id: searchId});
    } else {
      this.setState({loading:true},async ()=>{
        Object.keys(initialValues).forEach(f => {
          initialValues[f] = "";
        });
        const res = await getEmployee({role:"user"});
        if (res && res.data && res.data.length) {
          this.setState({length: res.data.length, Name: "Registration",loading:false});
        }else{
          this.setState({loading:false})
        }
      })
    }
    this.setState({
      designationValue: designationValue
    })
  }

  onSubmit = async (values, {setSubmitting, setErrors}) => {
    if(!values.designation){
      this.setState({designationError:"Designation is required"})
    }
    if(!values.qualification){
      this.setState({qualificationError:"Qualification is required"})
    }
    if(!values.gender){
      this.setState({genderError:"Gender is required"})
    }
    if(!values.designation || !values.qualification || !values.gender){
      return
    }
    const {searchId} = this.state;
    if (searchId) {
      values.id = searchId;
      const res = await employeeDetails(values);
      if (res && res.data) {
        toast.success(`User data updated  successfully!`, {
          position: toast.POSITION.TOP_RIGHT
        });
        this.props.history.push("/employee");
      }
    } else {
      const {length} = this.state;
      values.employeeCode = "BVM" + 0 + (length + 1);
      values.emailId = values.email;
      const response = await employeeDetails(values);
      if (response && response.data) {
        toast.success(`User created  successfully!`, {
          position: toast.POSITION.TOP_RIGHT
        });
        this.props.history.push("/employee");
      } else {
        toast.error(`something went wrong!`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    }
  };

  gotolist = () => {
    this.props.history.push("/employee");
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

  render() {
    const { pic, Name,qualificationError,genderError,loading, designationValue} = this.state;
    return (
      <div style={{marginRight: "100"}}>
        <div className="animated fadeIn">
          {loading ? <Loader/> : null}
          <CardHeader>
            <strong>{Name}</strong>
          </CardHeader>
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
                      <Form
                        onSubmit={handleSubmit}
                        noValidate
                        name="simpleForm"
                      >
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
                              invalid={
                                touched.dateOfBirth && !!errors.dateOfBirth
                              }
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
                              invalid={
                                touched.dateOfJoin && !!errors.dateOfJoin
                              }
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
                              <Input
                                type="select"
                                name="designation"
                                value={values.designation}
                                onChange={handleChange} id="ccyear">
                                <option value=''>Select Designation</option>
                                {
                                  designationValue &&  designationValue.data && designationValue.data.map((data, index) => {
                                    return(
                                      <option value={data.designationName} key={index}>{data.designationName}</option>
                                    )
                                  })
                                }
                              </Input>
                              <span className="invalid">
                                {errors.designation}
                              </span>
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="qualification">Qulification</Label>
                              <select
                                className="form-control"
                                name="qualification"
                                value={values.qualification}
                                id="qualification"
                                required
                                onChange={handleChange}
                              >
                                <option value="">Select Qualification</option>
                                {qualificationValue.map((value, index) => {
                                  return (
                                    <option key={index} value={value}>
                                      {value}
                                    </option>
                                  );
                                })}
                              </select>
                              <span className="invalid">
                                {qualificationError}
                              </span>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <FormGroup className="col-md-6">
                            Gender :{" "}
                            <input
                              type="radio"
                              className="pointer"
                              name="gender"
                              value="male"
                              checked={values.gender === "male"}
                              onChange={handleChange}
                              id="gender"
                              required
                            />
                            Male
                            <input
                              type="radio"
                              className="pointer"
                              name="gender"
                              value="female"
                              checked={values.gender === "female"}
                              onChange={handleChange}
                              id="gender"
                              required
                            />
                            Female
                            <br/>
                            <span className="invalid pb-3">
                              {genderError}
                            </span>
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
                            invalid={
                              touched.streetAddress && !!errors.streetAddress
                            }
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
                          <Button
                            color="secondary"
                            className="mr-1"
                            onClick={this.gotolist}
                          >
                            Go to list
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

export default Details;
