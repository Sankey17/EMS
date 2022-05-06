import React, { Component } from "react";
import { connect } from "react-redux";
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
  Row,
} from "reactstrap";
import {
  checkAuth,
  checkMail,
  forgotPassword,
} from "../../Services/actions/auth";
import { toast, ToastContainer } from "react-toastify";
import appConfig from "../../config";
import { Loader } from "../../globalutilities";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      emailError: "",
      passwordError: "",
      active: false,
      loading: false,
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submit = () => {
    const { email, password } = this.state;
    this.setState({ active: true, loading: true }, async () => {
      if (email && password) {
        const send = { email, password };
        const response = await checkMail(send);

        if (response && response.data) {
          const token = response.data.token;
          localStorage.setItem("token", token);
          await checkAuth(token);
          appConfig.token = token;
          this.setState({ active: false, loading: false });
          this.props.history.push("/");
        } else {
          this.setState({
            passwordError: "Invalid Password",
            emailError: "Invalid Email Id",
            active: false,
            loading: false,
          });
        }
      } else {
        this.setState({
          emailError: "Plz enter your email Id",
          passwordError: "Plz enter your password",
          active: false,
          loading: false,
        });
      }
    });
  };

  forgotPassword = async () => {
    const { email } = this.state;
    const res = await forgotPassword(email);
    if (res && res.message) {
      toast.success(
        `${res.message || "Check the mail and reset the password"} `,
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    } else {
      toast.error(`something went wrong !`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  render() {
    const { emailError, passwordError, active } = this.state;
    return (
      <div className="app flex-row align-items-center">
        {this.state.loading ? <Loader /> : null}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          style={{ zIndex: 1999 }}
        />
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Username"
                          autoComplete="username"
                          name="email"
                          onChange={this.onChange}
                        />
                      </InputGroup>
                      <p style={{ color: "red" }}>{emailError}</p>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          name="password"
                          onChange={this.onChange}
                        />
                      </InputGroup>
                      <p style={{ color: "red" }}>{passwordError}</p>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            className="px-4"
                            onClick={this.submit}
                            disabled={active}
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button
                            color="link"
                            className="px-0"
                            onClick={this.forgotPassword}
                          >
                            Forgot password?
                          </Button>
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

export default connect()(Login);
