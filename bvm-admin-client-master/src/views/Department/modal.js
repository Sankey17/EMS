import React from "react";
import {Modal} from "react-bootstrap";
import {Label, Input, Col, FormGroup} from 'reactstrap';
import {Button} from "reactstrap";

export const DepartmentModal = (props) => {
  const {addModal, department, addDepartment, handleCancel, handleChange, error, editDepartment, editIndex} = props;
  return (
    <Modal show={addModal}>
      <Modal.Body>
        <div className='text-center '>
          <h4>
            {
              !(editIndex && editIndex.length)
                ? " Add Department"
                : " Edit Department"
            }
          </h4>
        </div>
        <Col xs="12">
          <FormGroup>
            <Label htmlFor="name">Department Name:</Label>
            <Input type="text" id="name" name='department' value={department} onChange={handleChange} placeholder="department" required />
            <span className='text-danger'>{error}</span>
          </FormGroup>
        </Col>
      </Modal.Body>
      <Modal.Footer>
       <div>
         <Button onClick={!(editIndex && editIndex.length) ? addDepartment : editDepartment} className='mr-2' color="success">
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

export const AlertModal = (props) => {
  const {visible, onConfirm, onCancel} = props;
  return (
    <Modal show={visible}>
      <Modal.Body>
        <div className='text-center'>
          {props.children}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <Button onClick={onConfirm} className='mr-2' color="success">
            Yes
          </Button>
          <Button color="danger" onClick={onCancel}>
            No
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
};
