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

// Class-to-colour mapping
function getColourOne(d) {
  if (d === 0) return '#808080';
  if (d === 1) return '#006400';
  if (d === 2) return '#00008B';
  if (d === 3) return '#FFFFFF';
  return 'transparent';
  /// Colourmap source: https://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=6
}

// GeoTIFF loader
async function addLayer(url) {
  const response = await fetch(url);
  const data = await response.arrayBuffer();

  const georaster = await parseGeoraster(data);

  layerOne = new GeoRasterLayer({
    georaster,
    opacity: 0.7,

    pixelValuesToColorFn: (values) => {
      return getColourOne(values[0])
    }
  });

  layerOne.addTo(map);

  layerControl.addOverlay(layerOne, 'Prediction Raster');

  map.fitBounds(layerOne.getBounds());
}

// Load raster data
addLayer('../data/predicted_lulc.tif');

// Scale control
L.control.scale({
  position: 'bottomleft',
  imperial: false
}).addTo(map);

// Legend control
var legend = L.control({
  position: 'bottomright',
});

// Legend content generator
legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'legend');
  var grades = ['Built-up', 'Water', 'Vegetation'];

  div.innerHTML += '<h3>LEGEND</h3>';

  for (var i = 0; i < grades.length; i++) {
    var legendKey = grades[i];

    div.innerHTML += 
    '<span class="legend_row">' +
      '<span class="legend_box" style="background: ' + getColourOne(i) + ';"></span>' +
      legendKey +
    '</span>'
    ;
  }

  return div;
}

// Add legend to map
legend.addTo(map);
