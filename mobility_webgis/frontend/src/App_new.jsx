import * as React from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function App() {

  const LAYERS = {
    
    districts: {
      type: 'fill',
      paint: {
        'fill-color': '#f0e68c',
        'fill-opacity': 0.4
      }
    },

    roads: {
      type: 'line',
      paint: {
        'line-color': [
          'match',
          ['get', 'road_class'],
          'primary', '#d73027',
          'secondary', '#fc8d59',
          'tertiary', '#fee08b',
          '#4575b4'
        ],
        'line-width': 2
      }
    },

    rail: {
      type: 'line',
      paint: {
        'line-color': 'black',
        'line-width': 1.5
      }
    },

    canals: {
      type: 'line',
      paint: {
        'line-color': '#2b83ba',
        'line-width': 1.5
      }
    },

    bus_stops: {
      type: 'circle',
      minzoom: 12,
      paint: {
        'circle-color': 'yellow',
        'circle-radius': 5
      }
    },

    railway_stations: {
      type: 'circle',
      paint: {
        'circle-color': 'orange',
        'circle-radius': 6
      }
    }

  };

  const [layerData, setLayerData] = React.useState({});
  const [visibleLayers, setVisibleLayers] = React.useState(
    Object.fromEntries(
      Object.keys(LAYERS).map(layer => [layer, true])
    )
  );

  const [hoverInfo, setHoverInfo] = React.useState(null);

  const mapRef = React.useRef(null);
  const debounceRef = React.useRef(null);

  async function fetchLayer(layer, bbox) {
    const [minx, miny, maxx, maxy] = bbox;

    const res = await fetch(`http://localhost:3000/api/layers/${layer}/features?bbox=${minx},${miny},${maxx},${maxy}`);

    if (!res.ok) throw new Error('Failed to load ' + layer);

    return res.json();
  }

  function getBbox() {
    const map = mapRef.current?.getMap();
    if (!map) return null;

    const bounds = map.getBounds();

    return [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];
  }

  async function loadData() {

    const bbox = getBbox();
    if (!bbox) return;
    
    const results = await Promise.all(
      Object.keys(LAYERS).map(layer => 
        fetchLayer(layer, bbox)
      )
    );

    const newData = {};

    Object.keys(LAYERS).forEach((layer, i) => {
      newData[layer] = results[i];
    });

    setLayerData(newData);
  }

  return (    
    <div className='h-screen w-screen z-1'>
      <Map 
        ref={mapRef}
        onLoad={() => loadData()}
        onMoveEnd={() => {
          clearTimeout(debounceRef.current);

          debounceRef.current = setTimeout(() => {
            loadData();
          }, 300);
        }}
        initialViewState={{
          latitude: 52.15,
          longitude: 5.38,
          zoom: 6.5
        }}
        className='h-full w-full'
        mapStyle='https://tiles.openfreemap.org/styles/liberty'
        interactiveLayerIds={Object.keys(LAYERS).map(layer => `${layer}-layer`)}
        onMouseMove={e=> {
          const feature = e.features && e.features[0];

          if (feature) {
            setHoverInfo({
              id: feature.id,
              sourceName: feature.layer.source,
              properties: feature.properties
            })
          } else {
            setHoverInfo(null);
          }
        }} 
      >
      {Object.keys(LAYERS).map(layerName => {

        if (!visibleLayers[layerName]) return null;
        if (!layerData[layerName]) return null;

        const config = LAYERS[layerName];

        return (
          <Source
            key={layerName}
            id={layerName}
            type='geojson'
            data={layerData[layerName]}
          >
            <Layer
              id={`${layerName}-layer`}
              type={config.type}
              paint={config.paint}
              minzoom={config.minzoom}
            />
          </Source>
        );
      })}
        
      
      {hoverInfo && (
        <div className='absolute bottom-2 left-2 z-30 bg-white p-2 rounded shadow text-black'>
          <strong>Layer name:</strong> {hoverInfo.sourceName} <br />
          {Object.entries(hoverInfo.properties).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>

      )}

      <div 
        className='absolute top-2 right-2 z-20 bg-white text-black text-[2vh] rounded shadow p-2'>

        {Object.keys(LAYERS).map(layer => (

          <label key={layer}>
            <input
              type="checkbox"
              checked={visibleLayers[layer]}
              onChange={() => {
                setVisibleLayers(prev => ({
                  ...prev,
                  [layer]: !prev[layer]
                }));
              }}
            />
            {layer.replace("_", " ")}
          </label>

        ))}          


      </div>

      </Map>

    
    </div>
  );

}

export default App;