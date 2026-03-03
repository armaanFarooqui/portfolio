import * as React from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function App() {

  const [districts, setDistricts] = React.useState(null);
  const [roads, setRoads] = React.useState(null);

  const [showDistricts, setShowDistricts] = React.useState(true);
  const [showRoads, setShowRoads] = React.useState(true);

  const [hoverInfo, setHoverInfo] = React.useState(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        
        const [districtsRes, roadsRes] = await Promise.all([
          fetch('http://localhost:3000/api/districts'),
          fetch('http://localhost:3000/api/roads')
        ]);

        const [districtsData, roadsData] = await Promise.all([
          districtsRes.json(),
          roadsRes.json()
        ]);

        setDistricts(districtsData);
        setRoads(roadsData);

      } catch (err) {
          console.log(err);
      }
    }
    loadData();
  }, []);

  return (    
    <div className='h-screen w-screen z-1'>
      <Map
        initialViewState={{
          latitude: 52.15,
          longitude: 5.38,
          zoom: 6.5
        }}
        className='h-full w-full'
        mapStyle='https://tiles.openfreemap.org/styles/liberty'
        interactiveLayerIds={['districts-fill', 'districts-line', 'roads-line']}
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
      </Map>

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


      </div>
    
    </div>
  );

}

export default App;