import React from "react"
import { Col, Row, FormGroup } from 'reactstrap'
import Chart from "react-google-charts"

export const CalenderChart = ({years, year, handleYear, data}) => (
  <Row>
    <Col md={8}>
    </Col>
    <Col md={2}>
      <FormGroup>
        <select className="form-control"
                name="year"
                value={year}
                id="year"
                onChange={handleYear}>
          {years.map((value,index) => (<option key={index} value={value}>{value}</option>))}
        </select>
      </FormGroup>
    </Col>
    <Col md={12}>
      <Chart
        width={1000}
        height={200}
        chartType="Calendar"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
          title: "Attendance",
          calendar: {
            underYearSpace: 10, // Bottom padding for the year labels.
            monthLabel: {
              fontName: 'Times-Roman',
              fontSize: 12,
              color: '#4575e0',
              bold: true,
              italic: true
            },
            yearLabel: {
              fontName: 'Times-Roman',
              fontSize: 32,
              color: '#1A8763',
              bold: true,
              italic: true
            },
            underMonthSpace: 16
          },
          colorAxis: {
            minValue: 0,
            maxValue: 8,
            colors: ['#FF0000', '#00FF00']
          },
          tooltip: {
            isHtml: false
          }
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </Col>
  </Row>
)
