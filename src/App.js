import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">I'm so Mappy</h1>
        </header>
        <div id="displayPoints"></div>
        <div id="map"></div>
        <script src='https://api.mapbox.com/mapbox-assembly/mbx/v0.18.0/assembly.js'></script>
      </div>
      
    );
  }
}
export default App;
