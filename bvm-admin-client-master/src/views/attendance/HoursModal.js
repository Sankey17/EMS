import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import {Button, FormGroup, Input, Label} from "reactstrap";
import {Icon} from "antd";

class HoursModal extends Component {
  state = {
    disabled: true
  };

  handleEdit = () => {
    this.setState({
      disabled: !this.state.disabled
    })
  }

  render() {
    const {show, handleClose,modelData} = this.props;
    const {disabled} = this.state;
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Working Hours
            {
              disabled  ?
                <Icon
                  className="pointer float-right text-primary mt-2 ml-2"
                  type="edit"
                  theme="filled"
                  onClick={this.handleEdit}
                />
                :
                <Icon
                  className="pointer float-right text-danger mt-2 ml-2"
                  type="close-circle"
                  theme="filled"
                  onClick={this.handleEdit}
                />
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card-body">
            <div className="row">
              <FormGroup className="col-md-12">
                <Label for="lastName" className="text-primary">Work Time <b>(hrs)</b></Label>
                <Input
                  type="number"
                  name="workTime"
                  id="workTime"
                  placeholder="Hours"
                  required
                  onChange={this.props.onChange}
                  value={modelData.workTime || 0}
                  disabled={disabled}
                />
              </FormGroup>
              <FormGroup className="col-md-12">
                <Label for="lastName" className="text-warning">Lunch Time <b>(hrs)</b></Label>
                <Input
                  type="number"
                  name="lunchTime"
                  id="lunchTime"
                  placeholder="Hours"
                  required
                  onChange={this.props.onChange}
                  value={modelData.lunchTime || 0}
                  disabled={disabled}
                />
              </FormGroup>
              <FormGroup className="col-md-12">
                <Label for="lastName" className="text-danger">Break Time <b>(hrs)</b></Label>
                <Input
                  type="number"
                  name="breakTime"
                  id="breakTime"
                  placeholder="Hours"
                  required
                  onChange={this.props.onChange}
                  value={modelData.breakTime || 0}
                  disabled={disabled}
                />
              </FormGroup>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button onClick={this.props.onSubmit} className='mr-2' color="success" disabled={disabled}>
              Submit
            </Button>
            <Button color="danger" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default HoursModal


