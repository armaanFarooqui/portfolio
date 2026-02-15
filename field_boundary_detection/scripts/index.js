// Overlay layer reference
var layerOne;

// Base map layers
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'OpenStreetMap'
});

var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Esri World Imagery'
});

// Map initialisation
var map = L.map('map', {
  layers: [esri],
});

// Base layer control options
var baseMaps = {
  'Esri World Imagery': esri,
  'OpenStreetMap': osm,
};

// Layer control initialisation
var layerControl = L.control.layers(baseMaps, {}).addTo(map);

// Update overlay colour on basemap change
map.on('baselayerchange', function (e) {
  var colour = (e.name ==='OpenStreetMap') ? 'black' : 'yellow';

  layerOne.setStyle({
    color: colour,
  });
});

// Detect active basemap colour
function getCurrentColour() {
  return map.hasLayer(osm) ? 'black' : 'yellow';
}

// Vector styling
function style() {
  return {
    fill: false,
    color: getCurrentColour(),
    weight: 1
  }
}

// GeoJSON loader
async function addLayer(url) {
  const response = await fetch(url);
  const data = await response.json();

  layerOne = L.geoJSON(
    data, {
      style: style
    }
  ).addTo(map);

  layerControl.addOverlay(layerOne, 'Field Boundaries');

  map.fitBounds(layerOne.getBounds());
}

// Load vector data
addLayer('../data/output_vector.geojson');

// Scale control
L.control.scale({
  position: 'bottomleft',
  imperial: false
}).addTo(map);