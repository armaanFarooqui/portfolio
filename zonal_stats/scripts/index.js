/// Map 1


var mapOne = L.map('mapOne');
var layerOne;

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapOne);

L.control.scale({
    metric: true,
    imperial: false,
  }).addTo(mapOne);

function getColourOne(d) {
  d = Number(d);

  if (d >= 0.36 && d < 0.38) return '#d7191c';
  if (d >= 0.38 && d < 0.46) return '#fdae61';
  if (d >= 0.46 && d < 0.61) return '#ffffbf';
  if (d >= 0.61 && d < 0.73) return '#a6d96a';
  if (d >= 0.73)             return '#1a9641';

  return 'transparent';

  /// Colourmap source: https://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=5 
}

function styleOne(feature) {
  return {
    fillColor: getColourOne(feature.properties.mean_ndvi),
    fillOpacity: 0.7,
    color: 'black',
    weight: 2,
  }
}

function highlightOne(e) {
  var layer = e.target;

  layer.setStyle({
    fillOpacity: 1,
    color:'cyan',
    opacity: 1,
    weight: 3,
  });

  layer.bringToFront();
}

function resetOne(e){
  layerOne.resetStyle(e.target);
}

function zoomOne(e){
  mapOne.fitBounds(e.target.getBounds());
}

function eachOne(feature, layer) {
  layer.on({
    mouseover: highlightOne,
    mouseout: resetOne,
    click: zoomOne,
  });

  layer.bindTooltip(
    
    '<span class="tooltip_title">' + 'District Code: ' + '</span>' + feature.properties.district_code + '<br>' +
    '<span class="tooltip_title">' + 'Mean NDVI: ' + '</span>' + feature.properties.mean_ndvi.toString() + '<br>' +
    '<span class="tooltip_title">' + 'Min NDVI: ' + '</span>' + feature.properties.min_ndvi.toString() + '<br>' +
    '<span class="tooltip_title">' + 'Max NDVI: ' + '</span>' + feature.properties.max_ndvi.toString() + '<br>' 
    
  );
}

async function addLayerOne(url) {
  const response = await fetch(url);
  const data = await response.json();

  layerOne = L.geoJSON(
    data,
    {style: styleOne,
      onEachFeature: eachOne,
    }
  ).addTo(mapOne);

  mapOne.fitBounds(layerOne.getBounds());
  
}

addLayerOne('../data/ndvi_zonal_stats.geojson');

var legendOne = L.control({
  'position': 'bottomright',
});

legendOne.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  var grades = [0.36, 0.38, 0.46, 0.61, 0.73];

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
var layerTwo;

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
).addTo(mapTwo);

L.control.scale({
  metric: true,
  imperial: false
}).addTo(mapTwo);

function getColourTwo(d) {
  d = Number(d);

  if (d >= -0.24 && d < -0.15) return '#1a9641';
  if (d >= -0.15 && d < -0.10) return '#a6d96a';
  if (d >= -0.10 && d < -0.05) return '#ffffbf';
  if (d >= -0.05 && d <  0.01) return '#fdae61';
  if (d >= 0.01)               return '#d7191c';

  return 'transparent';

  /// Colourmap source: https://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=5 
}

function styleTwo(feature) {
  return {
    fillColor: getColourTwo(feature.properties.mean_ndbi),
    fillOpacity: 0.7,
    color:'black',
    weight: 2,
  }
}

function highlightTwo(e) {
  var layer = e.target;

  layer.setStyle({
    fillOpacity: 1,
    color: 'cyan',
    weight: 3
  });

  layer.bringToFront();
}

function resetTwo(e) {
  layerTwo.resetStyle(e.target);
}

function zoomTwo(e) {
  mapTwo.fitBounds(e.target.getBounds());
}

function eachTwo(feature, layer) {
  layer.on({
    mouseover: highlightTwo,
    mouseout: resetTwo,
    click: zoomTwo,
  });

  layer.bindTooltip(
      '<span class="tooltip_title">' + 'District code: ' + '</span>' + feature.properties.district_code + '<br>' +
      '<span class="tooltip_title">' + 'Mean NDBI: ' + '</span>' + feature.properties.mean_ndbi.toString() + '<br>' +
      '<span class="tooltip_title">' + 'Min NDBI: ' + '</span>' + feature.properties.min_ndbi.toString() + '<br>' +
      '<span class="tooltip_title">' + 'Max NDBI: ' + '</span>' + feature.properties.max_ndbi.toString()
  );

}

async function addLayerTwo(url) {
  const response = await fetch(url);
  const data = await response.json();

  layerTwo = L.geoJSON(
    data, {
      style: styleTwo,
      onEachFeature: eachTwo,
    }
  ).addTo(mapTwo);

  mapTwo.fitBounds(layerTwo.getBounds());
}

addLayerTwo('../data/ndbi_zonal_stats.geojson');

var legendTwo = L.control({
  'position': 'bottomright'
});

legendTwo.onAdd = function() {
  var div = L.DomUtil.create('div', 'legend');
  var grades = [-0.24, -0.15, -0.1 , -0.05,  0.01];

  div.innerHTML += '<h3>Mean NDBI</h3>';

  for (var i = 0; i < grades.length - 1; i++) {
    var from = grades[i];
    var to = grades[i+1];
      
    div.innerHTML += 
      '<div class="legend_row">' +
        '<span class="legend_box" style="background: ' + getColourTwo(from) + ';"></span>' +
        from + ' &ndash; ' + to +
      '</div>';
    }


  div.innerHTML += 
    '<div class="legend_row">' +
      '<span class="legend_box" style="background: ' + getColourTwo(to) + ';"></span>' +
      to + '+' +
    '</div>';
    
  return div;
}

legendTwo.addTo(mapTwo);