import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase";
import MobileDetect from "mobile-detect"
import {  XYPlot, XAxis,
  YAxis,VerticalBarSeries,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries} from 'react-vis';
import {curveCatmullRom} from 'd3-shape';
import '../node_modules/react-vis/dist/style.css';


const md = new MobileDetect(window.navigator.userAgent);

class App extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
      length:null,
      device:null,
      deviceCounts:{
        mobile: null,
        desktop: null
      },
      deviceBreakdown:{
        mobile1: null,
        mobile2: null,
        mobile3: null,
        desktop1: null,
        desktop2: null,
        desktop3: null,
      },
      buttonOrder: [1,2,3],
      options: [{id:1, name:"Electronics"}, {id:2, name:"Clothing"}, {id:3, name:"Automotives"}]
    }
  }

  componentDidMount() {
    console.log('amigo', md.mobile())
    const database = firebase.database().ref().child('users');
    database.on('value', snap=>{
      const data = snap.val()
      const arrayLength = (Object.keys(data).length);
      const mobile1 = Object.keys(data).filter(x=>{return (data[x].device =='mobile') && (data[x].category =='1')}).length
      const mobile2 = Object.keys(data).filter(x=>{return (data[x].device =='mobile') && (data[x].category =='2')}).length
      const mobile3 = Object.keys(data).filter(x=>{return (data[x].device =='mobile') && (data[x].category =='3')}).length
      const desktop1 = Object.keys(data).filter(x=>{return (data[x].device =='desktop') && (data[x].category =='1')}).length
      const desktop2 = Object.keys(data).filter(x=>{return (data[x].device =='desktop') && (data[x].category =='2')}).length
      const desktop3 = Object.keys(data).filter(x=>{return (data[x].device =='desktop') && (data[x].category =='3')}).length
      const mobileCount = mobile1 + mobile2 + mobile3
      const desktopCount = desktop1 + desktop2 + desktop3
      this.setState({length: arrayLength, userData: data})
      this.setState({deviceCounts: {desktop: desktopCount, mobile: mobileCount}})
      this.setState({deviceBreakdown: {mobile1, mobile2, mobile3, desktop1, desktop2, desktop3}})
    });
    const device = md.mobile() ? "mobile" : "desktop";
    this.setState({
      device: device,
      loaded: true,
    });
    fetch('http://localhost:600/predict', {
      method: "POST",
      body: device
    }).then(
      response=>{
        return  response.json()
      }
    ).then(data=>{
      const options = data.map(x => this.state.options[x-1])
      this.setState({options})
    })
  }

  buttonPress = (num) => {
      console.log('pressed')
      firebase.database().ref().child('users').push({
        "category":num,
        "device":this.state.device
  });
  }


  render() {

    return this.state.loaded ? (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <h1>{this.state.length}</h1>
        <h3> {this.state.device}</h3>
        <h2> Desktop Clicks: {this.state.deviceCounts.desktop}</h2>
        <h2> Mobile Clicks: {this.state.deviceCounts.mobile}</h2>

        {
          this.state.options.map(option=>
            <button onClick={() => this.buttonPress(option.id)}>{option.name}</button>
          )
        }

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
              {x: 'Mobile', y: this.state.deviceBreakdown.mobile1},
              {x: 'Desktop', y: this.state.deviceBreakdown.desktop1},
            ]}/>
          <VerticalBarSeries
          data={[
              {x: 'Mobile', y: this.state.deviceBreakdown.mobile2},
              {x: 'Desktop', y: this.state.deviceBreakdown.desktop2},
          ]}/>
          <VerticalBarSeries
            data={[
                {x: 'Mobile', y: this.state.deviceBreakdown.mobile3},
                {x: 'Desktop', y: this.state.deviceBreakdown.desktop3},
            ]}/>
        </XYPlot>
      </div>
    ) : (<div>loading</div>)
  }
}

export default App;
