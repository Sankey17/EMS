import React from "react";
import {Modal} from "react-bootstrap";
import {Label, Input, Col, FormGroup} from 'reactstrap';
import {Button} from "reactstrap";

export const AddModal = (props) => {
  const {addModal, designation, addDesignation, handleCancel, handleChange, departmentList, error, departmentId, editIndex, editDesignation} = props;
  return (
    <Modal show={addModal}>
      <Modal.Body>
        <div className='text-center '>
          <h4>
            {
              !(editIndex && editIndex.length)
                ? " Add Designation"
                : " Edit Designation"
            }
          </h4>
        </div>
        <Col xs="12">
          <FormGroup>
            <Label htmlFor="name">Designation Name:</Label>
            <Input type="text" id="name" name='designation' value={designation} onChange={handleChange} placeholder="designation" required />
            <span className='text-danger'>{error.designation}</span>
          </FormGroup>
        </Col>
        <Col xs="12">
            <FormGroup>
              <Label htmlFor="ccyear">Department Name : </Label>
              <Input type="select" name="departmentId" value={departmentId} onChange={handleChange} id="ccyear">
                <option value="">Select Department</option>
                {
                  departmentList.map((data, index) => {
                    return(
                      <option value={data._id} key={index}>{data.name}</option>
                    )
                  })
                }
              </Input>
              <span className='text-danger'>{error.department}</span>
            </FormGroup>
        </Col>
      </Modal.Body>
      <Modal.Footer>
          <div>
            <Button onClick={!(editIndex && editIndex.length) ? addDesignation : editDesignation} className='mr-2' color="success">
              Submit
            </Button>
            <Button color="danger" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
      </Modal.Footer>
    </Modal>
  )
}



