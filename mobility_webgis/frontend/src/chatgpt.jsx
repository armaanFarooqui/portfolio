import Map from "react-map-gl/maplibre";
import 'maplibre-gl/dist/maplibre-gl.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        initialViewState={{
          longitude: 6.89,
          latitude: 52.22,
          zoom: 12
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://demotiles.maplibre.org/style.json"
      />
    </div>
  );
}

export default App;