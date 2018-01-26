import React, { Component } from 'react'
let CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript');
import '../../../node_modules/codemirror/lib/codemirror.css';
//'../../../node_modules/codemirror/lib/codemirror.css'

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
    const options = { lineNumbers: true, mode: 'javascript' }
    return <CodeMirror value={this.state.code} onChange={this.updateCode} options={options} />
  }
}

export default codeEditor
