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
  if (d >= 12.902 && d < 31.080) return '#d7191c';
  if (d >= 31.080 && d < 41.941) return '#fdae61';
  if (d >= 41.941 && d < 44.894) return '#ffffbf';
  if (d >= 44.894 && d < 51.543) return '#a6d96a';
  if (d >= 51.543)               return '#1a9641';

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
  var grades = [12.902, 31.08, 41.941, 44.894, 51.543];

  div.innerHTML += '<h3>Bike Lane Density</h3>';

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
  if (d >= 0.015 && d < 0.121) return '#1a9641';
  if (d >= 0.121 && d < 0.172) return '#a6d96a';
  if (d >= 0.172 && d < 0.235) return '#ffffbf';
  if (d >= 0.235 && d < 0.304) return '#fdae61';
  if (d >= 0.304)              return '#d7191c';

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
  var grades = [0.015, 0.121, 0.172, 0.235, 0.304];

  div.innerHTML += '<h3>Building Density</h3>';

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
