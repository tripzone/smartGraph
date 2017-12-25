import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase";
import MobileDetect from "mobile-detect"

const md = new MobileDetect(window.navigator.userAgent);

class App extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
      length:null,
      device:null,
      usersData: null,
      deviceCounts:{
        mobile: null,
        desktop: null
      }
    }
  }

  componentDidMount() {
    console.log('amigo', md.mobile())
    const database = firebase.database().ref().child('users');
    database.on('value', snap=>{
      const data = snap.val()
      const arrayLength = (Object.keys(data).length);
      const mobileCount = Object.keys(data).filter(x=>data[x].device =='mobile').length
      const desktopCount = Object.keys(data).filter(x=>data[x].device =='desktop').length

      this.setState({length: arrayLength, userData: data})
      this.setState({deviceCounts: {desktop: desktopCount, mobile: mobileCount}})
    })
    this.setState({
      device: md.mobile() ? "mobile" : "desktop",
      loaded: true
    });
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
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <h1>{this.state.length}</h1>
        <h3> {this.state.device}</h3>
        <h2> Desktop Clicks: {this.state.deviceCounts.desktop}</h2>
        <h2> Mobile Clicks: {this.state.deviceCounts.mobile}</h2>
        <button onClick={() => this.buttonPress(1)}>Kasra</button>
      </div>
    ) : (<div>loading</div>)
  }
}

export default App;
