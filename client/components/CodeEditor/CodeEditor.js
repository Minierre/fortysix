import React, { Component } from 'react'
let CodeMirror = require('react-codemirror');

class codeEditor extends Component {
  constructor() {
    super();
    this.state = { code: '' }
  }
  getInitialState() {
		this.setState({ code: '// Code' })
	}
  updateCode(newCode) {
	  this.setState({
		  code: newCode,
	  })
  }
  render() {
    const options = { lineNumbers: true }
    return <CodeMirror value={this.state.code} onChange={this.updateCode} options={options} />
  }
}

export default codeEditor
