import React, {Component} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';
import {toast} from "react-toastify";

import {changePassword, updatepassword} from '../../actions'
import {Loader} from "../../globalutilities";

const queryString = require('query-string');

class resetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      emailError: '',
      passwordError: "",
      confirmPasswordError: "",
      token: "",
      matchError: "",
      loading:false
    }
  }

  componentWillMount = async () => {
    if (localStorage.getItem("token")) {
      this.setState({token: localStorage.getItem("token")})
    } else {
      const data = queryString.parse(this.props.location.search);
      this.setState({token: data.token})
    }
  };

  submit =  () => {
    const {password, confirmPassword, token} = this.state;
    if (!password) {
      this.setState({passwordError: "plz enter a password"})
    }
    if (!confirmPassword) {
      this.setState({confirmPasswordError: "plz enter a confirmpassword"})
    }
    if (!password || !confirmPassword) {
      return
    }
    if (password === confirmPassword) {
      this.setState({loading:true},async ()=>{
        if (localStorage.getItem("token")) {
          const res = await changePassword(password);
          if (res && res.data) {
            this.setState({loading:false})
            toast.success(`${res.data.message || "your password is changed Successfully"}`, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.history.push("/")
          } else {
            this.setState({loading:false})
            toast.error(`something went wrong !`, {
              position: toast.POSITION.TOP_RIGHT
            })
          }
        } else {
          const res = await updatepassword(token, password);
          if (res && res.data) {
            this.setState({loading:false})
            localStorage.removeItem("token");
            this.props.history.push("/login")
          } else {
            this.setState({loading:false})
            toast.error(`something went wrong !`, {
              position: toast.POSITION.TOP_RIGHT
            })
          }
        }
      })
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  };

  render() {
    const {confirmPasswordError, passwordError, confirmPassword, password, matchError,loading} = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          {loading ? <Loader/> : null}

          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Reset Password</h1>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"/>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="password" autoComplete="username" value={password}
                               name="password" onChange={this.onChange}/>
                      </InputGroup>
                      <p style={{color: "red"}}>{passwordError}</p>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"/>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="confirmPassword" autoComplete="current-password"
                               value={confirmPassword} name="confirmPassword" onChange={this.onChange}/>
                      </InputGroup>
                      <p style={{color: "red"}}>{confirmPasswordError}</p>
                      <p style={{color: "red"}}>{matchError}</p>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this.submit}>Submit</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>


    );
  }
}

export default resetPassword;
