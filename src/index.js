import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import mapboxgl from 'mapbox-gl';
// import ReactMapGL from 'react-map-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoibm1hc3RyYWNjaSIsImEiOiJjamkwanM3ZTkxOHl1M2twZGtxbXlkbHVhIn0.8FA150ofp_Ai4ANsDpYlDg';

// ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

// const element = <Welcome name="Natalie"/>;
// ReactDOM.render(
//     element,
//     document.querySelector('#displayPoints')
// );

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [-81.25162124633789,
        42.98206224605642
    ],
    zoom: 16,
    pitch: 60,
    localIdeographFontFamily: 'Raleway',
    collectResourceTiming: true
});
map.on('load', function () {
    map.addSource("London", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                    "type": "Feature",
                    "properties": {
                        "name": "RBC Tower",
                        "elevation_m": 1800
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-81.24825239181519,
                            42.98261166410607, 18000000
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-81.25162124633789,
                            42.98206224605642
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [-81.25022649765015,
                                    42.98495056028901
                                ],
                                [-81.24960422515869,
                                    42.983757577381226
                                ],
                                [-81.24765157699585,
                                    42.98432267743389
                                ],
                                [-81.24823093414307,
                                    42.985499952526624
                                ],
                                [-81.25022649765015,
                                    42.98495056028901
                                ]
                            ]
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-81.24879956245422,
                            42.981418635810876
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "name": "RBC Tower",
                        "elevation_m": 800
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-81.24934673309326,
                            42.98260773970883
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-81.2494432926178,
                            42.98269800078176
                        ]
                    }
                }
            ]
        }

    });
    //GENERIC AREA
    map.addLayer({
        "id": "Neighbourhood",
        "type": "fill",
        "source": "London",
        "paint": {
            "fill-color": "#555",
            "fill-opacity": 0.5
        },
        "filter": ["==", "$type", "Polygon"]
    });

    //POINTS
    map.addLayer({
        "id": "London Downtown",
        "type": "circle",
        "source": "London",
        "paint": {
            "circle-color": "#C965FF",
            "circle-radius": 5
        },
        "filter": ["==", "$type", "Point"],

    });
    let lat = -81.25574314216749;
    let lng = 42.9821305090085;
    // let pointLat = -79.22168254852295;
    // let pointLng = 43.1202506607777;

    map.addSource('littleCow', {
        "type": "geojson",
        "data": {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [lat, lng]
            }
        }
    });


    setInterval(() => {
        lat += 0.00002;
        lng += -0.00004;


        map.getSource('littleCow').setData({
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [lat, lng]
            }
        });

    }, 1500);
    map.addLayer({
        "id": "moving point",
        "source": "littleCow",
        "type": "circle",
        "paint": {
            "circle-color": "#E80CC8",
            "circle-radius": 10
        },
        "panBy": {
            "duration": 1000,
            "animate": true,
            "offset": [-79.22168254852295,
                43.1202506607777
            ]
        }
    });


});




