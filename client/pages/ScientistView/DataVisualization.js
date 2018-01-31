import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {
  BarChart,
  Bar,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

class DataVisualization extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props || []
    }
    console.log('props: ', props)
  }

  render() {
    return (
      <ResponsiveContainer height={700} width="80%">
        <BarChart
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          data={this.state.data}
          stackOffset="sign"
          >
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />

          <Bar dataKey="uv" fill="#82ca9d" stackId="stack" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

export default withRouter(DataVisualization)
