import React, { Component } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import debounce from 'lodash/debounce'
import './style.css'
import '../../../node_modules/codemirror/lib/codemirror.css'


require('codemirror/mode/javascript/javascript')

class CodeEditor extends Component {

  render() {
    const options = { lineNumbers: true, mode: 'javascript' }
    return (
      <div id="code-editor-wrapper">
        <div>
          <CodeMirror
            value={this.props.fitnessFunc}
            onBeforeChange={(editor, data, value) => {
              this.props.onChange({
                persist: () => {},
                target: {
                  value,
                  name: 'fitnessFunc'
                }
              })
            }}
            onBlur={(editor, event) =>
              // Hack: debounce this later
              this.props.submit({
                preventDefault: () => { },
                target: {
                  value: event.target.value,
                  name: 'fitnessFunc'
                }
              })
            }
            options={options}
          />
        </div>
      </div>
    )
  }
}

export default CodeEditor
