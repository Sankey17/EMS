import React from "react";
import {Modal} from "react-bootstrap";
import {Button, Col, FormGroup, Input, Label, Row} from "reactstrap";
import moment from "moment";

export const DetailsModal = (props) => {
  const {show, handleClose, updateStatus} = props;
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>Are you sure?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={updateStatus}>
          OK
        </Button>
        <Button variant="primary" onClick={handleClose}>
          cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export const LeaveUpdateModal = (props) => {
  const {show, handleClose, updateStatus, cancel, status} = props;
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        Are you sure? You want to <span className={status === "Approve" ? "text-success" : "text-danger"}><b>{status}</b></span> this leave?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={updateStatus}>
          OK
        </Button>
        <Button variant="primary" onClick={cancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export const HolidayModal = (props) => {
  const {show, handleClose, details, onChange, onSubmit, errors} = props;
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <h4>Add/Update Holiday</h4>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md="12" xs="12">
            <FormGroup className="col-md-12">
              <Label for="holidayDate"><b>Date</b></Label>
              <Input
                type="date"
                id="holidayDate"
                name="date"
                required
                placeholder="Date"
                value={(details.date && moment(details.date).format("YYYY-MM-DD")) || ""}
                min={moment(new Date()).format("YYYY-MM-DD")}
                onChange={onChange}
              />
              <span className="text-danger font-weight-bold"><small>{errors.date || ""}</small></span>
            </FormGroup>
          </Col>
          <Col md="12" xs="12">
            <FormGroup className="col-md-12">
              <Label for="title"><b>Title</b></Label>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                required
                onChange={onChange}
                value={details.title || ""}
              />
              <span className="text-danger font-weight-bold"><small>{errors.title || ""}</small></span>
            </FormGroup>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" className="btn-danger" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" className="btn-success" onClick={onSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
};
