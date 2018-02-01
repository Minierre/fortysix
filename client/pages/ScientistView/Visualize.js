import React, { Component } from 'react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from 'recharts'

class Visualize extends Component {
  render() {
    return (
      <div>
        <h4>Average Fitness Per Generation</h4>
        <ResponsiveContainer height={600} >
          <BarChart
            width={600}
            height={300}
            data={this.props.data}
            margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <XAxis dataKey="name">
              <Label value="Generations" offset={-10} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label
                value="Average Fitness"
                angle={-90}
                position="insideLeft"
                offset={20}
              />
            </YAxis>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar dataKey="fitness" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    )
  }
}

export default Visualize
