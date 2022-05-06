import React from "react"
import {Modal} from "react-bootstrap"
import {Label, Col, FormGroup} from 'reactstrap'

export const IsModal = (props) => {
  const {isModal, course, fees, description, onCancel} = props;
  return (
    <Modal show={isModal}
           size="lg"
           centered>
      <Modal.Header>
        <Modal.Title>
        <h2>View Course Detail</h2>
        </Modal.Title>
        <i className="fa fa-remove" onClick={onCancel} style={{cursor: "pointer"}}/>
      </Modal.Header>
      <Modal.Body>
        <Col xs="12">
          <FormGroup>
            <Label htmlFor="name">
              <h5>Course Name:</h5>
            </Label>&nbsp;{course}
          </FormGroup>
        </Col>
        <Col xs="12">
          <FormGroup>
            <Label htmlFor="name">
              <h5>Fees:</h5>
            </Label>&nbsp;{fees}
          </FormGroup>
        </Col>
        <Col xs="12">
          <FormGroup>
            <Label htmlFor="name">
              <h5>Description:</h5>
              <div dangerouslySetInnerHTML={{__html: description}}/>
            </Label>
          </FormGroup>
        </Col>
      </Modal.Body>
    </Modal>
  )
}
