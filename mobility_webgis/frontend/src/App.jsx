import * as React from 'react';
import {Map, Source, Layer} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function App() {

  const mapRef = React.useRef(null);
  const debounceRef = React.useRef(null);

  const [layerData, setLayerData] = React.useState({});

  const LW = 1.5;
  const LN = 'line';

  const CR = 'circle';
  const CW = 6;

  const LAYERS = {
    
    roads: {
      type: LN,
      paint: {
        'line-color': 'red',
        'line-width': LW
      },
    },

    rail: {
      type: LN,
      paint: {
        'line-color': 'blue',
        'line-width': LW
      }
    },

    canals: {
      type: LN,
      paint:{
        'line-color': 'blue',
        'line-width': LW
      }
    },

    'bus_stops': {
      type: CR,
      paint: {
        'circle-radius': CW,
        'circle-color': 'blue'
      }
    },

    'railway_stations': {
      type: CR,
      paint: {
        'circle-radius': CW,
        'circle-color': 'blue'
      }
    },

    districts: {
      type: 'fill',
      paint: {
        'fill-color': 'khaki',
        'fill-opacity': 0.3,
      }
    },


  };

  const [visibleLayer, setVisibleLayer] = React.useState(

    Object.fromEntries(
      Object.keys(LAYERS).map(layer => [layer, true])
    )

  );

  const [hoverInfo, setHoverInfo] = React.useState(null);

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
      `http://localhost:3000/api/layers/${layer}/features?bbox=${minx},${miny},${maxx},${maxy}`
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
          latitude:52.15,
          longitude:5.38,
          zoom: 6.5
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

              {layer}
              
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
                <strong>{key}: </strong> {value}
              </div>

            ))}

          </div>
        )}


      </Map>

    </div>
  );
}

export default App;