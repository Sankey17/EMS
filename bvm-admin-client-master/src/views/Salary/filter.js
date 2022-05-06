import React from "react";
import {Card, CardBody, Col, Collapse, FormGroup, Input, Label, Row} from "reactstrap";

const SalaryFilter= (props) => {
  const {collapse, yearValue, totalMonths , filterOnChange, filterSubmit,field} = props;
  return (
    <Collapse isOpen={collapse}>
      <Card>
        <CardBody>
          <Row>
            <Col lg="12">
              <Row>
                <FormGroup className="col-md-2">
                  <Label for="firstName"> Employees Code</Label>
                  <Input
                    type="text"
                    name="employeeCode"
                    id="EmployeeCode"
                    placeholder="EmployeeCode"
                    autoComplete="given-name"
                    required
                    onChange={filterOnChange}
                    value={field.employeeCode}
                  />
                </FormGroup>
                <FormGroup className="col-md-2">
                  <Label for="lastName">Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="name"
                    autoComplete="family-name"
                    required
                    onChange={filterOnChange}
                    value={field.firstName}
                  />
                </FormGroup>
                <FormGroup className="col-md-2">
                  <Label for="firstName">Year</Label>

                  <select className="form-control"
                          name="year"
                          onChange={filterOnChange}
                          value={field.year}
                  >
                    <option>Select Year</option>
                    {
                      yearValue && yearValue.length && yearValue.map((value, index) => {
                        return (
                          <option value={value} key={index}>{value}</option>
                        )
                      })
                    }

                  </select>
                </FormGroup>
                <FormGroup className="col-md-2">
                  <Label for="qualification">Month</Label>
                  <select className="form-control"
                          name="month"
                          onChange={filterOnChange}
                          value={field.month}
                  >
                    <option>Select Month</option>
                    {
                      totalMonths && totalMonths.length && totalMonths.map((value, index) => {
                        return (
                          <option value={value} key={index}>{value}</option>
                        )
                      })
                    }
                  </select>
                </FormGroup>
                <FormGroup className="col-md-2">
                  <Label for="lastName">Salary</Label>
                  <Input
                    type="number"
                    name="salary"
                    id="salary"
                    placeholder="salary"
                    required
                    onChange={filterOnChange}
                    value={field.salary}
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
}

export default SalaryFilter;
