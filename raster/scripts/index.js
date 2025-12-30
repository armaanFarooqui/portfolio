/// Map 1



var mapOne = L.map('mapOne').setView([52, 6], 13);
var layerOne;

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapOne);

function getColourOne(d) {
  if (d > -9999 && d < 0.0) return '#d73027';
  if (d >= 0.0 && d < 0.2) return '#fc8d59';
  if (d >= 0.2 && d < 0.4) return '#fee08b';
  if (d >= 0.4 && d < 0.6) return '#d9ef8b';
  if (d >= 0.6 && d < 0.8) return '#91cf60';
  if (d >= 0.8) return '#1a9850';

  return 'transparent';
  /// Colourmap source: https://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=6
}

async function addLayerOne(url) {
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

  layerOne.addTo(mapOne);
  mapOne.fitBounds(layerOne.getBounds());
}

addLayerOne('../data/ndvi/composite/ndvi_composite.tif');

L.control.scale({
  position: 'bottomleft',
  imperial: false
}).addTo(mapOne);

var legendOne = L.control({
  position: 'bottomright',
});

legendOne.onAdd = function() {
  var div = L.DomUtil.create('div', 'legend');
  var grades = [-1, 0.0, 0.2, 0.4, 0.6, 0.8];

  div.innerHTML += '<h3>LEGEND</h3>';

  for (var i = 0; i < grades.length - 1; i++) {
    var from = grades[i];
    var to = grades[i+1];
    var last = grades[grades.length - 1]

    div.innerHTML += 
    '<span class="legend_row">' +
      '<span class="legend_box" style="background: ' + getColourOne(from) + ';"></span>' +
      from + ' &ndash; ' + to +
    '</span>'
    ;
  }

  div.innerHTML += 
    '<span class="legend_row">' +
      '<span class="legend_box" style="background: ' + getColourOne(last) + ';"></span>' +
      last + '+' +
    '</span>';

  return div;
}

legendOne.addTo(mapOne);



/// Map 2



var mapTwo = L.map('mapTwo').setView([52, 6], 13);
var layerTwo;

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapTwo);

function getColourTwo(d) {
  if (d > -9999 && d < 0.0) return '#1a9850';
  if (d >= 0.0 && d < 0.2) return '#91cf60';
  if (d >= 0.2 && d < 0.4) return '#d9ef8b';
  if (d >= 0.4 && d < 0.6) return '#fee08b';
  if (d >= 0.6 && d < 0.8) return '#fc8d59';
  if (d >= 0.8) return '#d73027';
  return 'transparent';
}

async function addLayerTwo(url) {
  const response = await fetch(url);
  const data = await response.arrayBuffer();

  const georaster = await parseGeoraster(data);
  
  layerTwo = new GeoRasterLayer({
    georaster,
    opacity: 0.7,

    pixelValuesToColorFn: (values) => {
      return getColourTwo(values[0])
    }
  });

  layerTwo.addTo(mapTwo);
  mapTwo.fitBounds(layerTwo.getBounds());
}

addLayerTwo('../data/ndbi/composite/ndbi_composite.tif');

var legendTwo = L.control({
  position: 'bottomright',
});

legendTwo.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  var grades = [-1, 0.0, 0.2, 0.4, 0.6, 0.8];

  div.innerHTML += '<h3>LEGEND</h3>';

  for(var i = 0; i < grades.length - 1; i++) {
    var from = grades[i];
    var to = grades[i+1];
    var last = grades[grades.length - 1];

    div.innerHTML += 
      '<span class="legend_row">' +
        '<span class="legend_box" style="background: ' + getColourTwo(from) + ';"></span>' +
        from + ' &ndash; ' + to +
      '</span>';
  }

  div.innerHTML += 
    '<span class="legend_row">' +
      '<span class="legend_box" style="background: ' + getColourTwo(last) + ';"></span>' +
      last + '+' +
    '</span>';


  return div;
}

legendTwo.addTo(mapTwo);

L.control.scale({
  position: 'bottomleft',
  imperial: false,
}).addTo(mapTwo);
