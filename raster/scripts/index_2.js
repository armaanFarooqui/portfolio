/// Map 1



var mapOne = L.map('mapOne');

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapOne);

function getColourOne(v) {
  if (v == null ||
      !Number.isFinite(v) ||
      v === -9999
  )
    return null;
      
  return v > 0.8 ? '#1a9850':
         v > 0.6 ? '#91cf60':
         v > 0.4 ? '#d9ef8b':
         v > 0.2 ? '#fee08b':
         v > 0.0 ? '#fc8d59':
         v > -1.0 ? '#d73027':
                     null;
}

function getColourTwo(v) {
  if (v == null ||
      !Number.isFinite(v) ||
      v === -9999
  )
    return null;
      
  return v > 0.4 ? '#d73027':
         v > 0.0 ? '#fee08b':
         v > -1.0 ? '#1a9850':
                     null;
}


async function addLayerOne(url) {
  const response = await fetch(url);
  const data = await response.arrayBuffer();

  const georaster = await parseGeoraster(data);

  const layer = new GeoRasterLayer({
    georaster,
    opacity: 0.5,
    
    pixelValuesToColorFn: (values) => {
      return getColourOne(values[0])
      
    }

  });

  layer.addTo(mapOne);

  L.control.scale({
    metric: true,
    imperial: false
  }).addTo(mapOne);

  mapOne.fitBounds(layer.getBounds());
}

addLayerOne('../data/ndvi/composite/ndvi_composite.tif');

var legendOne = L.control({
  'position': 'bottomright',
});

legendOne.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  var grades = [1, 0.8, 0.4, 0.6, 0.2, 0.0, -1];

  div.innerHTML += '<h3>Mean NDVI</h3>';

  for (var i = 0; i < grades.length - 1; i++) {
    var from = grades[i];
    var to = grades[i+1];

    
    div.innerHTML += 
      '<div class="legend_row">' +
        '<span class="legend_box" style="background: ' + getColourOne(from) + ';"></span>' +
        from + ' &ndash; ' + to +
      '</div>';

    }

  div.innerHTML += 
    '<div class="legend_row">' +
      '<span class="legend_box" style="background: ' + getColourOne(to) + ';"></span>' +
      to + '+' +
    '</div>';

  return div;
}

legendOne.addTo(mapOne);




/// Map 2



var mapTwo = L.map('mapTwo');

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapTwo);

async function addLayerTwo(url) {
  const response = await fetch(url);
  const data = await response.arrayBuffer();

  const georaster = await parseGeoraster(data);

  const layer = new GeoRasterLayer({
    georaster,
    opacity: 0.6,
    
    pixelValuesToColorFn: (values) => {
      return getColourTwo(values[0])
      
    }
  });

  layer.addTo(mapTwo);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'legend'),
    grades = [1, 0.4, 0, -1];

    div.innerHTML += '<h3>LEGEND</h3>';

    for (var i = 0; i < grades.length - 1; i++) {
      div.innerHTML += 
      '<i style="background: ' + getColourTwo(grades[i]) + '"></i>' +
      grades[i] + ' &ndash; ' + grades[i+1]+ '</br>';

    }

    return div;
  };

  legend.addTo(mapTwo);

  L.control.scale({
    metric: true,
    imperial: false
  }).addTo(mapTwo);

  mapTwo.fitBounds(layer.getBounds());

}

addLayerTwo('../data/ndbi/composite/ndbi_composite.tif');

window.addEventListener('load', () => {
  mapOne.invalidateSize();
  mapTwo.invalidateSize();
});
