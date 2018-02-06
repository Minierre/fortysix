import React, { Component } from 'react'

class Timer extends Component {

  constructor() {
    super()
    this.state = {
      elapsed: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.start !== null && !this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.setState({
          elapsed: Date.now() - this.props.start
        })
      }, 70)
    } else if (nextProps.start === null && this.timerInterval) {
      this.resetTimer()
    }
  }

  parseTime(milliseconds) {
    if (milliseconds > 0) {
      const seconds = milliseconds / 1000
      const hours = Math.floor(seconds / 3600)
      // Helper function for converting a time segment to '00' when it is '0'.
      const pad = x => (x < 10 ? '0' + x : x)

      // Convert to human readable time.
      // Convert seconds into hours.
      const hr = seconds > 3600 ? `${Math.floor(seconds / 3600)}h` : ''
      // The difference of seconds un-rounded and hours in seconds rounded
      // and divides that by 60 to get the seconds in minutes. Then it rounds down.
      const min = seconds > 60 ? `${Math.floor((seconds - hours * 3600) / 60)}m` : ''
      // Convert seconds into a value 0-60 to fit the seconds place in timer.
      const sec = seconds > 0 ? `${Math.floor(seconds % 60)}s` : ''
      // Find the decimal value of seconds and covert it to milliseconds.
      const ms = `${pad(Math.floor((seconds % 1) * 100))}`

      return `${hr} ${min} ${sec} ${ms}`
    }

    return '0s 00'
  }

  resetTimer() {
    clearInterval(this.timerInterval)
    this.timerInterval = null
  }

  render() {
    const { elapsed } = this.state
    return (
      <h4>
        <strong>Elapsed: </strong>
        <em>{(this.parseTime(elapsed))}</em>
      </h4>
    )
  }
}

export default Timer
