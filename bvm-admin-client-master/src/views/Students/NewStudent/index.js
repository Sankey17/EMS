import React from "react";
import {toast} from "react-toastify";
import {Button, Card, CardBody ,FormText, CardHeader, Col, FormGroup, Input, Label} from "reactstrap";
import moment from "moment";
import userPic from "../../../assets/img/download.png";
import {getCourse, editStudent, postStudent, getStudentById} from "../../../actions";
import {Loader} from "../../../globalutilities";
import { Typography, Select } from "antd";

class NewStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: userPic,
      loading: false,
      pic: userPic,
      length:"",
      courseList: [],
      tags: [],
      gender:'',
      course: [],
      id: '',
      clear: true,
      name: 'Registration',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      dateOfJoin: '',
      address: '',
      error: {firstName: '', lastName: '', email: '', phone: '', dateOfJoin: '', dateOfBirth: '', address: '', tags: '', gender: ''}
    };
  }

  async componentDidMount() {
   if (this.props.location && this.props.location.state) {
    this.viewStudent(this.props.location.state)
   }
    const allCourseList = await getCourse()
    if (allCourseList && allCourseList.success) {
      this.setState({
        courseList: allCourseList.data.course
      })
    }
  }

  viewStudent = async(id) => {
    const res = await getStudentById(id)
    if (res && res.success) {
      const list = res.data.student
      this.setState({
        firstName: list.firstName,
        lastName: list.lastName,
        email: list.email,
        phone: list.phone.toString()      ,
        dateOfBirth: moment(list.dateOfBirth).format("YYYY-MM-DD"),
        dateOfJoin: moment(list.dateOfJoin).format("YYYY-MM-DD"),
        gender: list.gender,
        tags: list.tags,
        address: list.address,
        id,
        name: "View"
      })
    }
  }

  handleChange = (value) => {
   this.setState({
     tags: value
   })
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleReset = () => {
    this.setState({
      error: {}
    })
  }

  Validation = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value) {
          return "firstName is require"
        }else {
          return null
        }
      case "lastName":
        if (!value) {
          return "lastName is require"
        }else {
          return null
        }
      case "email":
        if (!value) {
          return "email is require"
        } else if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
          return "enter valid email"
        }else {
          return null
        }
      case "phone":
        if (!value) {
          return "phone is require"
        } else if (!value.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
          return "enter valid phone number"
        }else {
          return null
        }
      case "dateOfBirth":
        if (!value) {
          return "dateOfBirth is not valid"
        }else {
          return null
        }
      case "dateOfJoin":
        if (!value) {
          return "dateOfJoin is not valid"
        }else {
          return null
        }
      case "tags":
        if (!value.length > 0){
          return "course is require"
        }else {
          return null
        }
      case "gender":
        if (!value) {
          return "gender is require"
        }else {
          return null
        }
      case "address":
        if (!value) {
          return "address is require"
        }else {
          return null
        }
      default:
        return null
    }
  }

  onSubmit = async () => {
    const { firstName, lastName, email, phone, dateOfBirth, address, dateOfJoin, tags, gender, id} = this.state
    const allError = {}
    const myData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      dateOfBirth: dateOfBirth,
      address: address,
      dateOfJoin: dateOfJoin,
      tags: tags,
      gender: gender
    }
    Object.keys(myData).forEach((key) => {
      const error = this.Validation(key, myData[key])
      if (error) {
        allError[key] = error
      }
    })
    if (Object.keys(allError).length > 0) {
      this.setState({
        error: allError
      })
      return
    }
    const list = {firstName, lastName, email, phone, dateOfBirth, address, dateOfJoin, tags, gender}
    if(id !== '') {
      const res = await editStudent(id, list)
      if (res && res.data) {
        toast.success(`student updated successfully!`, {
          position: toast.POSITION.TOP_RIGHT
        });
        this.props.history.push("/student");
      }
    }else {
      const res = await postStudent(list);
      if (res && res.data) {
        toast.success(`student created successfully!`, {
          position: toast.POSITION.TOP_RIGHT
        });
        this.props.history.push("/student");
      }else {
        toast.error(`${res.message.response.data.error}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    }
    this.setState({
      error: ''
    })
  };

  gotolist = () => {
    this.props.history.push("/student");
  };

render() {
    const { name, loading, courseList, error, gender, tags, firstName, lastName, email, phone, dateOfBirth, dateOfJoin, address} = this.state;
    const { Option } = Select;
    return (
      <div style={{marginRight: "100"}}>
        <div className="animated fadeIn">
          {loading ? <Loader/> : null}
          <CardHeader>
            <strong>{name}</strong>
          </CardHeader>
          <Card>
            <CardBody>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">First Name:</Label>
                  <Input type="text" id="text-input" name="firstName" value={firstName} onChange={this.handleOnChange} placeholder="First Name" />
                  <FormText color="danger">{error.firstName}</FormText>
                </Col>
                <Col md="3">
                  <Label htmlFor="fees">Last Name:</Label>
                  <Input type="text" id="fees" name="lastName" value={lastName} onChange={this.handleOnChange} placeholder="Last Name" />
                  <FormText color="danger">{error.lastName}</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Email:</Label>
                  <Input type="text" id="text-input" name="email" value={email} onChange={this.handleOnChange} placeholder="Email" />
                  <FormText color="danger">{error.email}</FormText>
                </Col>
                <Col md="3">
                  <Label htmlFor="fees">Phone:</Label>
                  <Input type="number" id="fees" name="phone" value={phone} onChange={this.handleOnChange} placeholder="Phone" />
                  <FormText color="danger">{error.phone}</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Date Of Birth:</Label>
                  <Input type="date" id="text-input" name="dateOfBirth" value={dateOfBirth} onChange={this.handleOnChange} placeholder="Date Of Birth" />
                  <FormText color="danger">{error.dateOfBirth}</FormText>
                </Col>
                <Col md="3">
                  <Label htmlFor="fees">Date of Join:</Label>
                  <Input type="date" id="fees" name="dateOfJoin" value={dateOfJoin} onChange={this.handleOnChange} placeholder="Date of Join" />
                  <FormText color="danger">{error.dateOfJoin}</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md='3'>
                  <Label for="course">Course</Label>
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={this.handleChange}
                    value={tags}
                    allowClear={this.state.clear}
                  >
                    {
                      courseList && courseList.map((item, index) => {
                        return <Option key={item.course}>{item.course}</Option>
                      })
                    }
                  </Select>
                  <span className='invalid'>{error.tags}</span>
                </Col>
                <Col md='3'>
                  Gender :
                  <input
                    type="radio"
                    className="pointer"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={this.handleOnChange}
                    id="gender"
                    required
                  />
                  Male
                  <input
                    type="radio"
                    className="pointer"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={this.handleOnChange}
                    id="gender"
                    required
                  />
                  Female
                  <br/>
                  <span className="invalid">{error.gender}</span>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="6">
                  <Label htmlFor="textarea-input">Address:</Label>
                  <Input type="textarea" id="textarea-input" name="address" value={address} onChange={this.handleOnChange}  rows="4" placeholder="Address" />
                  <FormText color="danger">{error.address}</FormText>
                </Col>
              </FormGroup>
                <Button
                  type="submit"
                  color="primary"
                  className="mr-1"
                  onClick={this.onSubmit}
                >
                  Submit
                </Button>
                <Button
                  type="reset"
                  color="danger"
                  className="mr-1"
                  onClick={this.handleReset}
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
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

export default NewStudent;
