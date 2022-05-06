import React from "react";
import {
  Button,
  CardBody,
  CardHeader,
  Col,
  FormText,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import CKEditor from "ckeditor4-react";
import { postCourse, getCourseById, editCourse } from "../../../actions";
import { toast } from "react-toastify";

class NewCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "",
      name: "Registration",
      fees: "",
      description:
        (props.location &&
          props.location.state &&
          props.location.state.description) ||
        "",
      error: { course: "", fees: "", description: "" },
      id: "",
    };
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  componentDidMount() {
    const id =
      this.props &&
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.id;
    if (this.props.location && this.props.location.pathname === "/course/new") {
      this.setState({
        id: "",
      });
      return;
    }
    if (id) {
      this.updateCourse(id);
    }
  }

  updateCourse = async (id) => {
    const response = await getCourseById(id);
    const data = response.data.course;
    if (response.success) {
      this.setState({
        id,
        name: "View",
        course: data.course,
        fees: data.fees,
      });
    }
  };

  onEditorChange(evt) {
    this.setState({
      description: evt.editor.getData(),
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = async () => {
    const { description, fees, course, id } = this.state;
    const allError = {};
    if (!description) {
      allError.description = "description is require";
    }
    if (!fees || fees < 0) {
      allError.fees = "fees is not valid";
    }
    if (!course) {
      allError.course = "course is require";
    }
    if (!description || !fees || !course || fees < 0) {
      this.setState({
        error: allError,
      });
      return;
    }
    if (id !== "") {
      const result = await editCourse(id, course, fees, description);
      result.success && this.props.history.push("/course");
      toast.success(`course updated  successfully!`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      course.toLowerCase();
      const value = { description, course, fees };
      const response = await postCourse(value);
      if (response && response.success) {
        toast.success(`course created  successfully!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        this.props.history.push("/course");
      } else {
        toast.error(`${response.message.response.data.error}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    this.setState({
      id: "",
      error: {},
    });
  };

  goToList = () => {
    this.props.history.push("/course");
  };

  handleReset = () => {
    this.setState({
      error: "",
    });
  };

  render = () => {
    const { name, description, course, fees, error } = this.state;
    return (
      <div id="course" style={{ marginRight: "100" }}>
        <div className="animated fadeIn">
          <CardHeader>
            <strong>{name}</strong>
          </CardHeader>
          <CardBody>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Course:</Label>
                <Input
                  type="text"
                  id="text-input"
                  name="course"
                  value={course}
                  onChange={this.handleChange}
                  placeholder="course"
                />
                <FormText color="danger">{error.course}</FormText>
              </Col>
              <Col md="3">
                <Label htmlFor="fees">Fees:</Label>
                <Input
                  type="number"
                  id="fees"
                  name="fees"
                  value={fees}
                  onChange={this.handleChange}
                  placeholder="fees"
                />
                <FormText color="danger">{error.fees}</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="6">
                <Label htmlFor="text-input">Description:</Label>
                <CKEditor data={description} onChange={this.onEditorChange} />
              </Col>
            </FormGroup>
            <FormText color="danger">{error.description}</FormText>
            <FormGroup style={{ marginTop: 20 }}>
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
                onClick={this.goToList}
              >
                Go to list
              </Button>
            </FormGroup>
          </CardBody>
        </div>
      </div>
    );
  };
}

export default NewCourse;
