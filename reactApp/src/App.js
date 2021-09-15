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
// const pythonServer = "http://localhost:300"
const pythonServer = "http://52.206.147.144:3000"
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
      options: [{id:1, name:"Electronics"}, {id:2, name:"Clothing"}, {id:3, name:"Automotives"}],
      trainSuccess: null,
    }
  }

  componentDidMount() {
    const database = firebase.database().ref().child('users');
    database.on('value', snap=>{
      const data = snap.val()
      const arrayLength =  data ? (Object.keys(data).length) : 0;
      let mobile1 = 0;
      let mobile2 = 0;
      let mobile3 = 0;
      let desktop1 = 0;
      let desktop2 = 0;
      let desktop3 =0 ;
      if (arrayLength > 0 ){
        mobile1 = Object.keys(data).filter(x=>{return (data[x].device =='mobile') && (data[x].category =='1')}).length
        mobile2 = Object.keys(data).filter(x=>{return (data[x].device =='mobile') && (data[x].category =='2')}).length
        mobile3 = Object.keys(data).filter(x=>{return (data[x].device =='mobile') && (data[x].category =='3')}).length
        desktop1 = Object.keys(data).filter(x=>{return (data[x].device =='desktop') && (data[x].category =='1')}).length
        desktop2 = Object.keys(data).filter(x=>{return (data[x].device =='desktop') && (data[x].category =='2')}).length
        desktop3 = Object.keys(data).filter(x=>{return (data[x].device =='desktop') && (data[x].category =='3')}).length
      } 
      const mobileCount = mobile1 + mobile2 + mobile3
      const desktopCount = desktop1 + desktop2 + desktop3
      this.setState({length: arrayLength, userData: data})
      this.setState({deviceCounts: {desktop: desktopCount, mobile: mobileCount}})
      this.setState({deviceBreakdown: {mobile1, mobile2, mobile3, desktop1, desktop2, desktop3}})
    });
    const device = md.mobile() ? "mobile" : "desktop";
    this.setState({
      device: device,
    });
    fetch(pythonServer+'/predict', {
      method: "POST",
      body: device,
    }).then(
      response=>{
        return  response.json()
      }
    ).then(data=>{
      const options = data.map(x => this.state.options[x-1])
      this.setState({options})
      this.setState({
        loaded: true,
      });
    }).catch(err=>{
        console.log('PREDICT FAILED ', err)
        this.setState({
          loaded: true,
        });
    })
  }

  buttonPress = (num) => {
    console.log('pressed')
    firebase.database().ref().child('users').push({
      "category":num,
      "device":this.state.device
    });
  }

  trainModel = () => {
    fetch(pythonServer+'/train', {
      method: "POST",
    }).then(
      response=>{
        return  response.json()
      }
    ).then(data=>{
      this.setState({
        trainSuccess: true
      });
      console.log('Train Successful', data)
    }).catch(err=>{
      console.log('Train FAILED ', err)
      this.setState({
        trainSuccess: false
      });
    })
  }

  render() {

    return this.state.loaded ? (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <h1>count: {this.state.length}</h1>

        {
          this.state.options.map(option=>
            <button className={option.name} onClick={() => this.buttonPress(option.id)}>{option.name}</button>
          )
        }
        <div className="graphBox">
          <XYPlot
            className="graph"
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
        { this.state.device == "desktop" ? <button onClick={() => this.trainModel()}>Train</button> : null }

      </div>
    ) : (<div>loading</div>)
  }
}

export default App;
