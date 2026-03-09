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
    
    <div className='h-screen w-screen'>
      
      <Map
        className='h-full w-full'
        ref={mapRef}
        onLoad={loadData}

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

        initialViewState={{
          latitude:52.2225, 
          longitude:6.8925,
          zoom: 11
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

        <div 
          className='absolute top-2 right-2 z-20 bg-white text-black rounded shadow p-2'
        >

          {Object.keys(LAYERS).map(layer => (

            <div
              key={layer}
            >

            <label>
              <input
                type='checkbox'
                checked={visibleLayer[layer]}
                onChange={() => {
                  setVisibleLayer(prev => ({
                    ...prev,
                    [layer]: !prev[layer]
                  }));
                }}
              />

              {'\t'}{formatKey(layer)}
              
            </label>
            </div>

          ))}

        </div>

        {hoverInfo && (

          <div
            className='absolute bottom-2 left-2 z-20 bg-white text-black rounded shadow p-2'
          >

            <strong>Layer: </strong> {hoverInfo.source}

            {Object.entries(hoverInfo.properties).map(([key, value]) => (

              <div
                key={key}
              >
                <strong>{formatKey(key)}</strong>: {value}

                {key==='area' && <> km<sup>2</sup></>}

              </div>

            ))}

          </div>
        )}


      </Map>

    </div>
  );
}

export default App;