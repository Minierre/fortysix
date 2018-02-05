import React, { Component } from 'react'
import { Well, Col, Grid } from 'react-bootstrap'
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

import times from 'lodash/times'

import './style.css'

class Visualize extends Component {

  randomColors(multiplier = 0, differenceFactor = 10000) {
    const baseColorsDecimal = [
      14242639, // warning red
      6013150, // info blue
      6076508, // success green
      4361162 // primary blue
    ]
    const base =
      '#' + ((multiplier * differenceFactor + baseColorsDecimal[multiplier % 4]) % (16 ** 6)).toString(16)

    return base + ('0').repeat(7 - base.length)
  }

  render() {
    // TODO: Get last ten buckets
    // const lastTenDataBuckets =
    // this.props.data && this.props.data.slice(Math.max(this.props.data.length - 10, 0))
    return (
      <div>
        {
          this.props.data && this.props.data.length ?
            <div className="graph-wrapper">
              <div className="graph-title-wrapper">
                <h4>Normalized Z-Scores</h4>
              </div>
              <ResponsiveContainer height={600} >
                <BarChart
                  title="Normalized Z-Scores"
                  width={600}
                  height={300}
                  data={this.props.data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                  <XAxis dataKey="name">
                    <Label
                      value="Z-Scores"
                      offset={-10}
                      position="insideBottom"
                    />
                  </XAxis>
                  <YAxis tick={false}>
                    <Label
                      value="Percentage of Generation n"
                      angle={-90}
                      position="center"
                    />
                  </YAxis>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  {
                    // Get the top 10 oldest generation z-scores
                    times(10, i => (
                      <Bar
                        key={i}
                        dataKey={this.props.generations - i}
                        fill={this.randomColors(i)}
                        stackId="a"
                      />
                    ))
                  }
                </BarChart>
              </ResponsiveContainer>
            </div>
            :
            <div className="well">Data not available.</div>
        }
      </div>
    )
  }
}

export default Visualize
