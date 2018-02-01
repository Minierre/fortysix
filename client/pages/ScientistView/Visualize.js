import React, { Component } from 'react'
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva'
import map from 'lodash/map'

// import {
//   RadialBarChart, RadialBar, Legend
// } from 'recharts'

class Visualize extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      color: 'green'
    }
  }

  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  }

  render() {

    const colors = [
      '#8884d8',
      '#83a6ed',
      '#8dd1e1',
      '#82ca9d',
      '#a4de6c',
      '#d0ed57',
      '#ffc658'
    ]

    const buckets = this.props.data && map(this.props.data.bucket, (bucket, key) => {
      return bucket.fitnesses && bucket.fitnesses.map((fitness, i) => <Rect
        x={200 + 5 + i * 2}
        y={200 - 5 - i * 2}
        width={fitness / 200}
        height={fitness / 200}
        fill={colors[key - 1]}
        shadowBlur={5}
        onClick={this.handleClick}
      />
      )
    })

    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text text="Try click on rect" />
          {buckets}
        </Layer>
      </Stage>
    );
  }
}

export default Visualize

  //   BarChart,
  //   Bar,
  //   ReferenceLine,
  //   XAxis,
  //   YAxis,
  //   CartesianGrid,
  //   Tooltip,
  //   Legend,
  //   ResponsiveContainer

  // const colors = [
    //   '#8884d8',
    //   '#83a6ed',
    //   '#8dd1e1',
    //   '#82ca9d',
    //   '#a4de6c',
    //   '#d0ed57',
    //   '#ffc658'
    // ]

    // const data = map(this.props.data.bucket, (bucket, key, i) => ({
    //   name: 'bucket ' + key, uv: 31.47, pv: 2400, fill: colors[0]
    // }))

    // // const data = [
    // //   { name: '18-24', uv: 31.47, pv: 2400, fill: '#8884d8' },
    // //   { name: '25-29', uv: 26.69, pv: 4567, fill: '#83a6ed' },
    // //   { name: '30-34', uv: 15.69, pv: 1398, fill: '#8dd1e1' },
    // //   { name: '35-39', uv: 8.22, pv: 9800, fill: '#82ca9d' },
    // //   { name: '40-49', uv: 8.63, pv: 3908, fill: '#a4de6c' },
    // //   { name: '50+', uv: 2.63, pv: 4800, fill: '#d0ed57' },
    // //   { name: 'unknow', uv: 6.67, pv: 4800, fill: '#ffc658' }
    // // ]

    // const style = {
    //   top: 0,
    //   left: 350,
    //   lineHeight: '24px'
    // }

  // < ResponsiveContainer height = { 700} width = "80%" >
  //   <BarChart
  //     margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
  //     data={this.state.data}
  //     stackOffset="sign"
  //   >
  //     <XAxis dataKey="name" />
  //     <YAxis />
  //     <Legend />

  //     <Bar dataKey="uv" fill="#82ca9d" stackId="stack" />
  //   </BarChart>
  //     </ResponsiveContainer >

  // < RadialBarChart width = { 500} height = { 300} cx = { 150} cy = { 150} innerRadius = { 20} outerRadius = { 140} barSize = { 10} data = { data } >
  //   <RadialBar minAngle={15} label background clockWise={true} dataKey='uv' />
  //   <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' wrapperStyle={style} />
  //     </RadialBarChart >
