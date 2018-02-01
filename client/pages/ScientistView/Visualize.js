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
    const data = [
      { name: 'Generation 1', fitness: 402 },
      { name: 'Generation 2', fitness: 3300 },
      { name: 'Generation 3', fitness: 232 },
      { name: 'Generation 4', fitness: 333 },
      { name: 'Generation 5', fitness: 444 },
    ]
    return (
      <div>
        <h4>Average Fitness Per Generation</h4>
        <ResponsiveContainer height={600} >
          <BarChart
            width={600}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <XAxis dataKey="name">
              <Label value="Generations" offset={-10} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label
                value="Average Fitness"
                angle={-90}
                position="insideLeft"
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
