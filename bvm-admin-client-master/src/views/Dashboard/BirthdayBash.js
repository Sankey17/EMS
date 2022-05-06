import React, {Component} from 'react';
import {Col, Row} from 'reactstrap'

import {birthDayCheck} from "../../actions";
import birthDayCake from "../../assets/img/birthday-cake.gif";

class BirthdayBash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      birthDay: [],
      isBirthToday: false,
    }
  }

  async componentWillMount() {
    const res = await birthDayCheck()
    if (res && res.data && res.data.length) {
      const birthName = res.data.map(v => v.firstName)
      this.setState({birthDay: birthName, isBirthToday: true})
    }
  }

  render() {
    const {isBirthToday, birthDay} = this.state;
    return (
      <Row>
        <Col md="1"/>
        {isBirthToday ? birthDay.map((v, i) => {
            return (
              <Col key={i} md={birthDay.length === 1 ? "12" : "4"}>
                <blockquote className="padd2">
                  <img src={birthDayCake} width={20} height={20} alt="Birthday cake"/>
                  <p>Wishing you much happiness on your special day.</p>
                  <small>{v}</small>
                </blockquote>
              </Col>
            )
          })
          :
          <blockquote className="thought padd">
            <p>Today is a wonderful day to have a wonderful day!</p>
          </blockquote>
        }
      </Row>
    )
  }
}

export default BirthdayBash

