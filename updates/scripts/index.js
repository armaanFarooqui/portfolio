var map = L.map('map').setView([52,6], 13);
var layerOne;

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map);

function getColour(d) {
  if (d >= 0.36 && d < 0.38) return '#d7191c';
  if (d >= 0.38 && d < 0.46) return '#fdae61';
  if (d >= 0.46 && d < 0.61) return '#ffffbf';
  if (d >= 0.61 && d < 0.73) return '#a6d96a';
  if (d >= 0.73)             return '#1a9641';

  return 'transparent';

/// https://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=5
}

function style(feature) {
  return {
    fillColor: getColour(feature.properties.mean_ndvi),
    fillOpacity: 0.7,
    color: 'black',
    weight: 2
  }
}

function highlight(e) {
  var layer = e.target;

  layer.setStyle({
    fillOpacity: 1,
    color: 'cyan',
    weight: 3
  });

  layer.bringToFront();
}

function reset(e) {
  layerOne.resetStyle(e.target);
}

function zoom(e) {
  map.fitBounds(e.target.getBounds());
}

function each(feature, layer){
  layer.on({
    mouseover: highlight,
    mouseout: reset,
    click: zoom,
  });

  layer.bindTooltip(
    '<span class="tooltip_title">' + 'District Code: ' + '</span>' + feature.properties.district_code + '<br>' +
    '<span class="tooltip_title">' + 'Mean NDVI: ' + '</span>' + feature.properties.mean_ndvi.toString() + '<br>' +
    '<span class="tooltip_title">' + 'Min NDVI: ' + '</span>' + feature.properties.min_ndvi.toString() + '<br>' +
    '<span class="tooltip_title">' + 'Max NDVI: ' + '</span>' + feature.properties.max_ndvi.toString()
  );
}

async function addLayer(url) {
  const response = await fetch(url);
  const data = await response.json();

  layerOne = L.geoJSON(
    data, {
      style: style,
      onEachFeature: each,
    }
  ).addTo(map);

  map.fitBounds(layerOne.getBounds());
}

addLayer('../data/latest/ndvi_stats_latest.geojson');

L.control.scale({
  position: 'bottomleft',
  metric: true,
  imperial: false
}).addTo(map);

var legend = L.control({
  position: 'bottomright'
});

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  var grades = [0.36, 0.38, 0.46, 0.61, 0.73] 
;

  div.innerHTML += '<h3>LEGEND</h3>';

  for (var i = 0; i < grades.length - 1; i++) {
    var from = grades[i];
    var to = grades[i+1];
    var last = grades[grades.length - 1];

    div.innerHTML +=
      '<span class="legend_row">' +
        '<span class="legend_box" style="background: ' + getColour(from) + ';"></span>' +
        from + ' &ndash; ' + to +
      '</span>';
  }

  div.innerHTML += 
    '<span class="legend_row">' +
      '<span class="legend_box" style="background: ' + getColour(to) + ';"></span>' + 
      last + '+' +
    '</span>';

  return div;
}

legend.addTo(map);