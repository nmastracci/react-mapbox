import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactMapGl from 'react-map-gl';
import './App.css';

const MAPBOX_TOKEN = 
'pk.eyJ1Ijoibm1hc3RyYWNjaSIsImEiOiJjamkwanM3ZTkxOHl1M2twZGtxbXlkbHVhIn0.8FA150ofp_Ai4ANsDpYlDg';

class App extends Component {

  state = {
    mapStyle: deafultMapStyle,
    viewport: {
      latitude: 40,
      longitude: -100,
      zoom: 3,
      bearing: 0,
      pitch: 0,
      width: 500,
      height: 500

    }

  };

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();

    requestJson('data/us-income.geojson', (error, response) => {
      if (!error) {
        this._loadData(response);
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
  };

  _loadData = data => {

    updatePercentiles(data, f => f.properties.income[this.state.year]);

    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'incomeByState'], fromJS({type: 'geojson', data}))
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    this.setState({data, mapStyle});
  };

  _updateSettings = (name, value) => {
    if (name === 'year') {
      this.setState({year: value});

      const {data, mapStyle} = this.state;
      if (data) {
        updatePercentiles(data, f => f.properties.income[value]);
        const newMapStyle = mapStyle.setIn(['sources', 'incomeByState', 'data'], fromJS(data));
        this.setState({mapStyle: newMapStyle});
      }
    }
  };

  _onViewportChange = viewport => this.setState({viewport});

  _onHover = event => {
    const {features, srcEvent: {offsetX, offsetY}} = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'data');

    this.setState({hoveredFeature, x: offsetX, y: offsetY});
  };

  _renderTooltip() {
    const {hoveredFeature, year, x, y} = this.state;

    return hoveredFeature && (
      <div className="tooltip" style={{left: x, top: y}}>
        <div>State: {hoveredFeature.properties.name}</div>
        <div>Median Household Income: {hoveredFeature.properties.value}</div>
        <div>Percentile: {hoveredFeature.properties.percentile / 8 * 100}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">I'm so Mappy</h1>
        </header>
        <div id="displayPoints"></div>
        <div id="map"></div>
        <ReactMapGl 
        mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange={this._onViewportChange} 
        ></ReactMapGl>
      </div>
      
    );
  }
}

export default App;
