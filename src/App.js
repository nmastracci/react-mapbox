import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactMapGl from 'react-map-gl';
import './App.css';
import {json as requestJson} from 'd3-request';
import ReactDOM from 'react-dom';
import {fromJS} from 'immutable';
// import MAP_STYLE from 'map-style-basic-v8.json';
import {range} from 'd3-array';
import {scaleQuantile} from 'd3-scale';

export function updatePercentiles(featureCollection, accessor) {
  const {features} = featureCollection;
  const scale = scaleQuantile().domain(features.map(accessor)).range(range(9));
  features.forEach(f => {
    const value = accessor(f);
    f.properties.value = value;
    f.properties.percentile = scale(value);
  });
}

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = fromJS({
  id: 'data',
  source: 'incomeByState',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'percentile',
      stops: [
        [0, '#3288bd'],
        [1, '#66c2a5'],
        [2, '#abdda4'],
        [3, '#e6f598'],
        [4, '#ffffbf'],
        [5, '#fee08b'],
        [6, '#fdae61'],
        [7, '#f46d43'],
        [8, '#d53e4f']
      ]
    },
    'fill-opacity': 0.8
  }
});

export const defaultMapStyle = fromJS(MAP_STYLE);

const MAPBOX_TOKEN = 
'pk.eyJ1Ijoibm1hc3RyYWNjaSIsImEiOiJjamkwanM3ZTkxOHl1M2twZGtxbXlkbHVhIn0.8FA150ofp_Ai4ANsDpYlDg';

function Welcome(props) {
      return <h1>Hello, {props.name}</h1>;
  }
  
  const element = <Welcome name="Natalie"/>;
  ReactDOM.render(
      element,
      document.querySelector('#displayPoints')
  );

class App extends Component {

  state = {
    mapStyle: defaultMapStyle,
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
    requestJson('data/us-income.geojson', (error, response) => {
      if (!error) {
        this._loadData(response);
      }
    });
  }

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
