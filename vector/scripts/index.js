/// Map 1



var mapOne = L.map('mapOne').setView([52, 6], 13);
var layerOne;

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapOne);

L.control.scale({
  'position': 'bottomleft',
  'metric': true,
  'imperial': false
}).addTo(mapOne);

function getColourOne(d) {
  if (d >= 12.9 && d < 31.06) return '#d7191c';
  if (d >= 31.06 && d < 41.95) return '#fdae61';
  if (d >= 41.95 && d < 44.89) return '#ffffbf';
  if (d >= 44.89 && d < 51.49) return '#a6d96a';
  if (d >= 51.49)               return '#1a9641';

  return 'transparent';
}

function styleOne(feature) {
  return {
    fillColor: getColourOne(feature.properties.bikeway_density),
    fillOpacity: 0.7,
    color: 'black',
    weight: 2,
  }
}

function HighlightOne(e) {
  var layer = e.target;

  layer.setStyle({
    fillOpacity: 1,
    color: 'white',
    weight: 3,
  });

  layer.bringToFront();
}

function resetOne(e) {
  layerOne.resetStyle(e.target);
}

function zoomOne(e) {
  mapOne.fitBounds(e.target.getBounds());
}

function eachOne(feature, layer) {
  layer.on({
    mouseover: HighlightOne,
    mouseout: resetOne,
    click: zoomOne,
  })

  layer.bindTooltip(
    '<span class="tooltip_title">' + 'District Code: ' + '</span>'+ feature.properties.district_code + '<br>' +
    '<span class="tooltip_title">' + 'Bike Lane Density: ' + '</span>' + feature.properties.bikeway_density
  );
}

async function addLayerOne(url) {
  const response = await fetch(url);
  const data = await response.json();

  layerOne = L.geoJSON(
    data, {
      style: styleOne,
      onEachFeature: eachOne,
    }
  ).addTo(mapOne);

  mapOne.fitBounds(layerOne.getBounds());

}

addLayerOne('../data/bike_lane_density.geojson');

var legendOne = L.control({
  'position': 'bottomright'
})

legendOne.onAdd = function(feature) {
  var div = L.DomUtil.create('div', 'legend');
  var grades = [12.9, 31.06, 41.95, 44.89, 51.49];

  div.innerHTML += '<h3>LEGEND</h3>';

  for (var i = 0; i < grades.length - 1; i++) {
    
    var from = grades[i];
    var to = grades[i+1];

    div.innerHTML += 
      '<span class="legend_row">' +
        '<span class="legend_box" style="background:' + getColourOne(from) + '"></span>' +
        from + ' &ndash; ' + to +
        
      '</span>';
  }

  div.innerHTML +=
    '<span class="legend_row">' +
      '<span class="legend_box" style="background:' + getColourOne(to) + '"></span>' +
      to + '+' +
    '</span>';

  return div;
}

legendOne.addTo(mapOne);



/// Map Two



var mapTwo = L.map('mapTwo').setView([52,6],13);
var layerTwo;

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapTwo);

L.control.scale({
  'position': 'bottomleft',
  'metric': true,
  'imperial': false,
}).addTo(mapTwo);

function getColourTwo(d) {
  if (d >= 0.02 && d < 0.12) return '#1a9641';
  if (d >= 0.12 && d < 0.17) return '#a6d96a';
  if (d >= 0.17 && d < 0.23) return '#ffffbf';
  if (d >= 0.23 && d < 0.3) return '#fdae61';
  if (d >= 0.3)              return '#d7191c';

  return 'transparent';
}

function styleTwo(feature) {
  return {
    fillColor: getColourTwo(feature.properties.building_footprint_density),
    fillOpacity: 0.7,
    color: 'black',
    weight: 2,
  }
}

function highlightTwo(e) {
  var layer = e.target;

  layer.setStyle({
    fillOpacity: 1,
    color: 'white',
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
    '<span class="tooltip_title">' + 'District Code: ' + '</span>' + feature.properties.district_code + '<br>' +
    '<span class="tooltip_title">' + 'Building Footprint Density: ' + '</span>' + feature.properties.building_footprint_density
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

addLayerTwo('../data/building_footprint_density.geojson');

var legendTwo = L.control({
  'position': 'bottomright'
})

legendTwo.onAdd = function() {
  var div = L.DomUtil.create('div', 'legend');
  var grades = [0.02, 0.12, 0.17, 0.23, 0.3 ];

  div.innerHTML += '<h3>LEGEND</h3>';

  for (var i = 0; i < grades.length - 1; i++) {
    var from = grades[i];
    var to = grades[i+1];

    div.innerHTML += 
      '<span class="legend_row">' +
        '<span class="legend_box" style="background:' + getColourTwo(from) + '"></span>' +
        from + ' &ndash; ' + to + 
      '</span>';

  }

  div.innerHTML += 
    '<span class="legend_row">' +
      '<span class="legend_box" style="background: ' + getColourTwo(to) + '"></span>' +
      to + '+' +
    '</span>';

  return div;
}

legendTwo.addTo(mapTwo);
