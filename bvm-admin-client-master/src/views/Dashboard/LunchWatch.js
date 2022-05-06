import React, { Component } from "react";

class LunchWatch extends Component {
  state = {
    timerOn: false,
    timerStart: 0,
    timerTime: 0
  }

  componentWillMount() {
    const { lunchStart, currentlyInProgress } = this.props
    if (lunchStart) {
      const that = this
      this.setState({
        timerOn: true,
        timerTime: currentlyInProgress.lunchTime || 0,
        timerStart: currentlyInProgress.watchStartTime - (currentlyInProgress.lunchTime || 0)
      }, () => {
        that.timer = setInterval(() => {
          that.setState({
            timerTime: Date.now() - that.state.timerStart
          });
        }, 10);
      });
    }else {
      if(currentlyInProgress){
        const state = {}
        if(currentlyInProgress.lunchTime){
          state.timerTime = currentlyInProgress.lunchTime || 0
        }
        this.setState({
          ...state
        })
      }
    }
  }

  startTimer = () => {
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: Date.now() - this.state.timerTime
    });
    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart
      });
    }, 10);
    this.props.onStart()
  }

  stopTimer = () => {
    this.setState({ timerOn: false });
    clearInterval(this.timer);
    this.props.onStop()
  }

  render() {
    const { timerTime } = this.state;
    //const centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
    const seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    const minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    const hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

    return (
      <div className="Stopwatch lunch">
        <div className="Stopwatch-header">Lunch</div>
        <div>
          <div className="timer">
            {hours}&nbsp;:&nbsp;
            <p><small>Hours</small></p>
          </div>
          <div className="timer">
            {minutes}&nbsp;:&nbsp;
            <p><small>Minutes</small></p>
          </div>
          <div className="timer">
            {seconds}
            <p><small>Seconds</small></p>
          </div>
        </div>
        <br/>
        {this.state.timerOn === false && this.state.timerTime === 0 && (
          <button onClick={this.startTimer}>Start</button>
        )}
        {this.state.timerOn === true && (
          <button onClick={this.stopTimer}>Stop</button>
        )}
        {!((this.state.timerOn === false && this.state.timerTime === 0) || (this.state.timerOn === true)) ? (
          <button
            style={{
              pointerEvents: "none",
              opacity: 0.65,
            }}
            disabled
          >Lunch Over</button>
        ) : null}
      </div>
    );
  }
}
export default LunchWatch;
