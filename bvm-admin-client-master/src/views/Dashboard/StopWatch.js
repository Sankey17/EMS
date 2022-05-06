import React, { Component } from "react";

class Stopwatch extends Component {
  state = {
    timerOn: false,
    timerStart: 0,
    timerTime: 0
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.lunchStart !== this.props.lunchStart) {
      if(this.props.lunchStart){
        this.setState({ timerOn: false });
        clearInterval(this.timer);
      }else {
        // this.startTimer()
      }
    }
  }

  componentWillMount() {
    const { workStart, currentlyInProgress } = this.props
    if (workStart) {
      const that = this
      this.setState({
        timerOn: true,
        timerTime: currentlyInProgress.workTime || 0,
        timerStart: currentlyInProgress.watchStartTime - (currentlyInProgress.workTime || 0)
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
        if(currentlyInProgress.workTime){
          state.timerTime = currentlyInProgress.workTime || 0
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

  resetTimer = () => {
    this.setState({
      timerStart: 0,
      timerTime: 0
    });
  }

  render() {
    const { timerTime } = this.state;
    //const centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
    const seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    const minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    const hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

    return (
      <div className="Stopwatch">
        <div className="Stopwatch-header">On Demand</div>
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
         {/* <div>
            {centiseconds}
            <small>Centi Seconds</small>
          </div> */}
        </div>
        <br/>
        {this.state.timerOn === false && this.state.timerTime === 0 && (
          <button onClick={this.startTimer}>Start</button>
        )}
        {this.state.timerOn === true && (
          <button onClick={this.stopTimer}>Stop</button>
        )}
        {this.state.timerOn === false && this.state.timerTime > 0 && (
          <button onClick={this.startTimer}>Resume</button>
        )}
        {/* {this.state.timerOn === false && this.state.timerTime > 0 && (
          <button onClick={this.resetTimer}>Reset</button>
        )} */}
      </div>
    );
  }
}
export default Stopwatch;
