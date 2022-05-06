import React from "react";
import {Card, CardBody, Col, Collapse, FormGroup, Input, Label, Row} from "reactstrap";

const collapseCard = (props) => {
  const {
    collapse, employeeCode, name, email, phone, designation, designationValue,
    qualification, qualificationValue, date, filterOnChange, filterSubmit
  } = props;
  return (
    <Collapse isOpen={collapse}>
      <Card>
        <CardBody>
          <Row>
            <Col lg="12">
              <Row>
                <FormGroup className="col-md-3">
                  <Label for="firstName"> Employees Code</Label>
                  <Input
                    type="text"
                    name="employeeCode"
                    id="EmployeeCode"
                    placeholder="EmployeeCode"
                    autoComplete="given-name"
                    required
                    onChange={filterOnChange}
                    value={employeeCode}
                  />
                </FormGroup>
                <FormGroup className="col-md-3">
                  <Label for="lastName">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="name"
                    autoComplete="family-name"
                    required
                    onChange={filterOnChange}
                    value={name}
                  />
                </FormGroup>
                <FormGroup className="col-md-3">
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    required
                    onChange={filterOnChange}
                    value={email}
                  />
                </FormGroup>
                <FormGroup className="col-md-3">
                  <label htmlFor="phone">Phone</label>
                  <Input
                    type="number"
                    name="phone"
                    id="phone"
                    placeholder="Phone"
                    autoComplete="phone"
                    required
                    onChange={filterOnChange}
                    value={phone}
                  />
                </FormGroup>
              </Row>
              <Row>
                <FormGroup className="col-md-3">
                  <Label for="firstName"> Designation</Label>
                  <Input
                    type="select"
                    name="designation"
                    value={designation}
                    onChange={filterOnChange} id="ccyear">
                    <option value="">Select Designation</option>
                    {
                      designationValue &&  designationValue.data && designationValue.data.map((data, index) => {
                        return(
                          <option value={data.designationName} key={index}>{data.designationName}</option>
                        )
                      })
                    }
                  </Input>
                </FormGroup>
                <FormGroup className="col-md-3">
                  <Label for="qualification">Qualification</Label>
                  <select className="form-control"
                          name="qualification"
                          onChange={filterOnChange}
                          value={qualification}
                  >
                    <option>Select qualification</option>
                    {
                      qualificationValue.map((value, index) => {
                        return (
                          <option value={value} key={index}>{value}</option>
                        )
                      })
                    }
                  </select>
                </FormGroup>
                <FormGroup className="col-md-3">
                  <Label for="qualification">Date of Birth</Label>
                  <Input
                    type="date"
                    name="date"
                    id="date"
                    placeholder="date"
                    autoComplete="given-name"
                    required
                    onChange={filterOnChange}
                    value={date}
                  />
                </FormGroup>
              </Row>
              <div align="right">
                <button className="btn btn-primary" onClick={filterSubmit}>Submit</button>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Collapse>
  )
};

export default collapseCard;
