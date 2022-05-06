import React from "react"
import { Col, Row, Input, FormGroup } from 'reactstrap'
import Chart from "react-google-charts"

export const ColumnChart = ({selectedDate, handleDateSelection, dayData}) => (
  <Col md={4}>
    <Row>
      <Col md={7}>
      </Col>
      <Col md={5}>
        <FormGroup>
          <Input
            type="date"
            id="selectedDate"
            name="selectedDate"
            value={selectedDate || ""}
            onChange={handleDateSelection}
          />
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={dayData}
        />
      </Col>
    </Row>
  </Col>
)
export const AdminColumnChart = ({selectedName, handleDateSelection, data,names}) => (
  <Col md={4}>
    <Row>
      <Col md={7}>
      </Col>
      <Col md={2}>
        <FormGroup>
         <select className="form-control"
                  name="selectedName"
                  value={selectedName}
                  id="year"
                  onChange={handleDateSelection}>
            {names.map((value,index) => (<option key={index} value={value}>{value}</option>))}
          </select>
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={data}
        />
      </Col>
    </Row>
  </Col>
)

