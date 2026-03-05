import * as React from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function App() {

  const [districts, setDistricts] = React.useState(null);
  const [roads, setRoads] = React.useState(null);
  const [rail, setRail] = React.useState(null);
  const [canals, setCanals] = React.useState(null);
  const [busStops, setBusStops] = React.useState(null);
  const [railwayStations, setRailwayStations] = React.useState(null);

  const [showDistricts, setShowDistricts] = React.useState(true);
  const [showRoads, setShowRoads] = React.useState(true);
  const [showRail, setShowRail] = React.useState(true);
  const [showCanals, setShowCanals] = React.useState(true);
  const [showBusStops, setShowBusStops] = React.useState(true);
  const [showRailwayStations, setShowRailwayStations] = React.useState(true);

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
      try {

        const bbox = getBbox();
        if (!bbox) return;

        const [
          districtsData, 
          roadsData, 
          railData, 
          canalsData, 
          busStopsData, 
          railwayStationsData
        ] = await Promise.all([
          fetchLayer('districts', bbox),
          fetchLayer('roads', bbox),
          fetchLayer('rail', bbox),
          fetchLayer('canals', bbox),
          fetchLayer('bus_stops', bbox),
          fetchLayer('railway_stations', bbox)
        ]);

        setDistricts(districtsData);
        setRoads(roadsData);
        setRail(railData);
        setCanals(canalsData);
        setBusStops(busStopsData);
        setRailwayStations(railwayStationsData);
        

      } catch (err) {
          console.log(err);
      }
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
        interactiveLayerIds={['districts-fill', 'districts-line', 'roads-line', 'rail-line', 'canals_line', 'bus_stops_circle', 'railway_stations_circle']}
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
        
      {showDistricts && districts && (
        <Source id='Districts' type='geojson' data={districts}>
          
          <Layer
            id='districts-fill'
            type='fill'
            paint={{
              'fill-color': '#f0e68c',
              'fill-opacity': 0.4
            }}
          />

          <Layer 
            id='districts-line'
            type='line'
            paint={{
              'line-width': 5,
            }}
          />

        </Source>
      )}

      {showRoads && roads && (
        <Source id='Roads' type='geojson' data={roads}>
          <Layer
            id='roads-line'
            type='line'
            paint={{
              'line-color': 'navy',
              'line-opacity': 0.8,
              'line-width': 1.5
            }} 
          />
        </Source>
      )}

      {showRail && rail && (
        <Source id='rail' type='geojson' data={rail}>
          <Layer 
            id='rail-line'
            type='line'
            paint={{
              'line-color': 'navy',
              'line-width': 1.5
            }}
          />
        </Source>
      )}

      {showCanals && canals && (
        <Source id='Canals' type='geojson' data={canals}>
          <Layer
            id='canals_line'
            type='line'
            paint={{
              'line-color': 'navy',
              'line-width': 1.5
            }} 
          />
        </Source>
      )}

      {showBusStops && busStops && (
        <Source id='Bus stops' type='geojson' data={busStops}>
          <Layer
            id='bus_stops_circle'
            type='circle'
            paint={{
              'circle-color': 'yellow',
              'circle-radius': 5,
            }} 
          />
        </Source>
      )}

      {showRailwayStations && railwayStations && (
        <Source id='Railway stations' type='geojson' data={railwayStations}>
          <Layer
            id='railway_stations_circle'
            type='circle'
            paint={{
              'circle-color': 'orange',
              'circle-radius': 5,
            }} 
          />
        </Source>
      )}
      
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
          
          <label>
            <input 
              type='checkbox'
              checked={showDistricts}
              onChange={() => setShowDistricts(prev => !prev)}
            />
            Districts
          </label>
          <br />

          <label>
            <input
              type='checkbox'
              checked={showRoads}
              onChange={() => setShowRoads(prev => !prev)} 
            />
            Roads
          </label>
          <br />

          <label>
            <input
              type='checkbox'
              checked={showRail}
              onChange={() => setShowRail(prev => !prev)} 
            />
            Rail
          </label>
          <br />

          <label>
            <input
              type='checkbox'
              checked={showCanals}
              onChange={() => setShowCanals(prev => !prev)} 
            />Canals
          </label>
          <br />

          <label>
            <input
              type='checkbox'
              checked={showBusStops}
              onChange={() => {setShowBusStops(prev => !prev)}} 
            />Bus stops
          </label>
          <br />

          <label>
            <input
              type='checkbox'
              checked={showRailwayStations}
              onChange={() => {setShowRailwayStations(prev => !prev)}} 
            />Railway stations
          </label>


      </div>

      </Map>

    
    </div>
  );

}

export default App;