import * as React from 'react';
import {Map, Source, Layer} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function App() {

  const mapRef = React.useRef(null);
  const debounceRef = React.useRef(null);

  const [layerData, setLayerData] = React.useState({});

  const LWS = 1.5;
  const LWL = 10;
  const LN = 'line';

  const CR = 'circle';
  const CWS = 6;
  const CWL = 8

  const COLOURS = {
    roads_primary: 'salmon',
    roads_secondary: 'gold',
    roads_tertiary: 'limegreen',
    rail: 'darkorange',
    canals: 'blue',
    bus_stops: 'cyan',
    railway_stations: 'red',
    districts: 'transparent',
    default_roads: 'grey'
};

  const LAYERS = {
    
    roads: {
      type: LN,
      paint: {
        'line-color': [
          'match',
          ['get', 'road_type'],

          ['primary', 'primary_link'], COLOURS.roads_primary,
          ['secondary', 'secondary_link'], COLOURS.roads_secondary,
          ['tertiary', 'tertiary_link'], COLOURS.roads_tertiary,

          'grey'
        ],

        'line-width': [
          'match',
          ['get', 'road_type'],

          ['primary', 'primary_link',
            'secondary', 'secondary_link',
            'tertiary', 'tertiary_link',
          ], LWL,

          LWS
        ],
      },
    },

    rail: {
      type: LN,
      paint: {
        'line-color': COLOURS.rail,
        'line-width': LWL
      }
    },

    canals: {
      type: LN,
      paint:{
        'line-color': COLOURS.canals,
        'line-width': LWL
      }
    },

    'bus_stops': {
      type: CR,
      paint: {
        'circle-radius': CWS,
        'circle-color': COLOURS.bus_stops,
        'circle-stroke-color': 'black',
        'circle-stroke-width': 2,
      }
    },

    'railway_stations': {
      type: CR,
      paint: {
        'circle-radius': CWL,
        'circle-color': COLOURS.railway_stations,
        'circle-stroke-color': 'black',
        'circle-stroke-width': 2,
      }
    },

    districts: {
      type: 'fill',
      paint: {
        'fill-color': COLOURS.districts,
        'fill-opacity': 0.1,
      }
    },


  };

  const [visibleLayer, setVisibleLayer] = React.useState(

    Object.fromEntries(
      Object.keys(LAYERS).map(layer => [layer, true])
    )

  );

  const [hoverInfo, setHoverInfo] = React.useState(null);

  const formatKey = k => k.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

  function getBbox() {
    
    const map = mapRef.current.getMap();
    if (!map) return;

    const bounds = map.getBounds();

    return [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ];

  }

  async function fetchLayer(layer, bbox) {
    
    const [minx, miny, maxx, maxy] = bbox;

    const res = await fetch(
      `/api/layers/${layer}/features?bbox=${minx},${miny},${maxx},${maxy}`
    );

    if (!res.ok) {
      throw new Error(`Failed to load ${layer} roads`);
    }

    return res.json();
  }

  async function loadData() {
    
    const bbox = getBbox();
    if (!bbox) return null;

    const results = await Promise.all(
      Object.keys(LAYERS).map(layer => fetchLayer(layer, bbox))
    );

    const newData = {};

    Object.keys(LAYERS).forEach((layer, i) => {
      newData[layer] = results[i];
    })

    setLayerData(newData);
  }

  return (
    
    <div className='flex flex-col h-screen w-screen'>

      <div className='navbar flex justify-center items-center bg-[#343434] text-white font-bold text-2xl'>
            Enschede Mobility WebGIS
      </div>

      
      <div className='flex-1'>
        <Map
          className='h-full w-full'
          ref={mapRef}
          onLoad={() => {

            const map = mapRef.current.getMap();
            const padding = window.innerHeight * 0.01;

            map.fitBounds(
              [
                [6.7558927101514543,52.1612059178504879], 
                [6.9811000525028186,52.2855057474762432]
              ],
              { 
                padding: padding,
                duration: 0
              }
            );

            loadData();

          }}

          onMouseMove={e => {
            
            const feature = e.features?.[0]

            if (feature) {
              setHoverInfo({
                source: feature.source,
                properties: feature.properties
              });
            } else {
              setHoverInfo(null);
            }

          }}

          interactiveLayerIds={
            Object.keys(LAYERS).map(layer => `${layer}-layer`)
          }

          onMoveEnd={() => {

            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(loadData, 300);

          }}


          mapStyle='https://tiles.openfreemap.org/styles/liberty'
        >

          {Object.keys(LAYERS).map(layer => {

            const config = LAYERS[layer];

            if (!layerData[layer] || !visibleLayer[layer]) return null;

            return (

              <Source
                key={layer}
                id={layer}
                type='geojson'
                data={layerData[layer]}
              >

                <Layer
                  id={`${layer}-layer`}
                  type={config.type}
                  paint={config.paint} 
                />

                {layer === 'districts' && (

                  <Layer
                    id={`${layer}-line`}
                    type='line'
                    paint={{
                      'line-color': 'black',
                      'line-width': 3
                    }}
                  />

                )}


              </Source>
            );
          })}


          <div className='card absolute top-2 right-2 z-20 bg-white text-black shadow-lg'>
            <div className='card-body'>

              <div className='card-title justify-center'>
                LAYERS
              </div>

              <label>

                {Object.keys(LAYERS).map(layer => (

                  <div className='flex space-x-2' key={layer}>

                    <input
                      type='checkbox'
                      className='checkbox checkbox-sm checkbox-primary'
                      checked={visibleLayer[layer]}
                      onChange={() => {
                        setVisibleLayer(prev => ({
                          ...prev,
                          [layer]: !prev[layer]
                        }));
                      }}
                    >
                    </input>

                    <div>
                      {formatKey(layer)}
                    </div>

                  </div>

                ))}

              </label>

            </div>

          </div>

          {hoverInfo && (

            <div className='card absolute bottom-2 left-2 z-20 bg-white shadow-lg text-black'>
              <div className='card-body'>
                
                <div className='card-title justify-center'>
                  INFO
                </div>

                <div>
                  <strong>Layer: </strong> {hoverInfo.source}
                </div>

                {Object.entries(hoverInfo.properties).map(([key, value]) => (

                  <div key={key}>
                    <strong>{formatKey(key)}: </strong> {value}
                  </div>

                ))}

                

              </div>

            </div>
          )}

        </Map>
      </div>

    </div>
  );
}

export default App;