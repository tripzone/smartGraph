import {BarChart, Bar,AreaChart, Area,  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

<LineChart width={600} height={300} data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
  <XAxis dataKey="name"/>
  <YAxis/>
  <CartesianGrid strokeDasharray="3 3"/>
  <Tooltip/>
  <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
</LineChart>

<AreaChart width={600} height={400} data={data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
  <XAxis dataKey="name"/>
  <YAxis/>
  <CartesianGrid strokeDasharray="3 3"/>
  <Tooltip/>
  <Area type='monotone' dataKey='uv' stackId="1" stroke='#8884d8' fill='#8884d8' />
  <Area type='monotone' dataKey='pv' stackId="1" stroke='#82ca9d' fill='#82ca9d' />
  <Area type='monotone' dataKey='amt' stackId="1" stroke='#ffc658' fill='#ffc658' />
</AreaChart>  

----------------------------

import rd3 from 'rd3';

var pieData = [
  {label: 'Margarita', value: 20.0},
  {label: 'John', value: 55.0},
  {label: 'Tim', value: 25.0 }
];
var PieChart = rd3.PieChart;
var BarChart = rd3.BarChart
var barData = [
  {
    "name": "Series A",
    "values": [
      { "x": 1, "y":  91},
      { "x": 2, "y": 290},
      { "x": 3, "y": -25},
    ]
  },
  {  
    "name": "Series B",
    "values": [
      { "x": 1, "y":  9},
      { "x": 2, "y": 49},
      { "x": 3, "y": -20},
    ]
  },
  {  
    "name": "Series C",
    "values": [
      { "x": 1, "y":  14},
      { "x": 2, "y": 77},
      { "x": 3, "y": -70},
    ]
  }
];


<PieChart
  data={pieData}
  width={400}
  height={400}
  radius={100}
  innerRadius={20}
  fill="white"
  sectorBorderColor="white"
  title="Pie Chart" />

<BarChart
      data={barData}
      width={500}
      height={300}
      title="Bar Chart"
      xAxisLabel="Value"
      yAxisLabel="Label" 
      gridHorizontal={true} />

-------------------

import {  XYPlot, XAxis,
  YAxis,VerticalBarSeries,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries} from 'react-vis';
import {curveCatmullRom} from 'd3-shape';
import '../node_modules/react-vis/dist/style.css';


<XYPlot
  xType="ordinal"
  width={300}
  height={300}
  xDistance={100}
  >
  <VerticalGridLines />
  <HorizontalGridLines />
  <XAxis />
  <YAxis />
  <VerticalBarSeries
    data={[
      {x: 'Mobile', y: 52},
      {x: 'Desktop', y: 22},
    ]}/>
  <VerticalBarSeries
    data={[
      {x: 'Mobile', y: 12},
      {x: 'Desktop', y: 2},
    ]}/>
</XYPlot>
