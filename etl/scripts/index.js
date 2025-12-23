/// Map 1

var mapOne = L.map('mapOne');
var layerOne;

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapOne);

function getColourOne(d) {
  return d > 51.543 ? '#006837':
         d > 44.894 ? '#51b35e':
         d > 41.928 ? '#84ca66':
         d > 31.08  ? '#addc6f':
         d > 12.902 ? '#fff6b0':
                      '#a50026';
}

function styleOne(feature) {
  return {
    fillColor: getColourOne(feature.properties.bikeway_density),
    fillOpacity: 0.7,
    weight: 2,
    color: 'black',
  }
}

function highlightOne(e) {
  var layer = e.target;

  layer.setStyle({
    fillOpacity: 1,
    weight: 3,
    color: 'cyan',
  });

  layer.bringToFront();
}

function resetOne(e) {
  layerOne.resetStyle(e.target);
}

function zoomOne(e) {
  mapOne.fitBounds(e.target.getBounds());
}

function onOne(feature, layer) {
  layer.on({
    mouseover: highlightOne,
    mouseout: resetOne,
    click: zoomOne,
  });

  layer.bindTooltip(
    '<span class="tooltip_title"> District Code: </span>' + feature.properties.district_code + '<br>' +
    '<span class="tooltip_title"> Bikeway density: </span>' + feature.properties.bikeway_density.toString(), {
      className: 'tooltip_style',
    });

}

async function addLayerOne(url) {
  const response = await fetch(url);
  const data = await response.json();

  layerOne = L.geoJSON(data, {
    style: styleOne,
    onEachFeature: onOne}).addTo(mapOne);

  L.control.scale({
    metric:true,
    imperial:false
  }).addTo(mapOne);

  mapOne.fitBounds(layerOne.getBounds());
}

addLayerOne('../data/bike_lane_density.geojson');

var legendOne = L.control({position: 'bottomright'});

legendOne.onAdd = function () {

  var div = L.DomUtil.create('div', 'legend'),
  
  grades = [12.902, 31.08, 41.928, 44.894, 51.543],
  labels = [];

  div.innerHTML += '<h3>LEGEND</h3>';

  for (var i =0; i < grades.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColourOne(grades[i]) + '"></i>' +
    grades[i] + (grades[i+1] ? ' &ndash; ' + grades[i+1] + '<br>': '+');
  }

  return div;

}

legendOne.addTo(mapOne);


/// Map Two



var mapTwo = L.map('mapTwo');
var layerTwo;

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapTwo);

function getColourTwo(d) {
  return d > 0.304 ? '#a50026':
         d > 0.235 ? '#f8864f':
         d > 0.171 ? '#feca79':
         d > 0.121 ? '#fff2aa':
         d > 0.015 ? '#c7e77f':
                     '#006837';
}

function styleTwo(feature) {
  return {
    fillColor: getColourTwo(feature.properties.building_footprint_density),
    fillOpacity: 0.7,
    weight: 2,
    color: 'black'
  }
}

function highlightTwo(e) {
  var layer = e.target;

  layer.setStyle({
    fillOpacity: 1,
    weight: 3,
    color: 'cyan',
  })

  layer.bringToFront();
}

function resetTwo(e) {
  layerTwo.resetStyle(e.target);
}

function zoomTwo(e) {
  mapTwo.fitBounds(e.target.getBounds());

}

function onTwo(feature, layer) {
  layer.on({
    mouseover: highlightTwo,
    mouseout: resetTwo,
    click: zoomTwo,
  });

  layer.bindTooltip(
    '<span class="tooltip_title">District Code: </span>' + feature.properties.district_code + '<br>' +
    '<span class="tooltip_title">Building Footprint Density: </span>' + feature.properties.building_footprint_density.toString(), 
    {
      className: 'tooltip_style'
    }
  );
}

async function addLayerTwo(url) {
  const response = await fetch(url);
  const data = await response.json();

  layerTwo = L.geoJSON(data, {
    style: styleTwo,
    onEachFeature: onTwo,
  }).addTo(mapTwo);

  L.control.scale({
    metric:true,
    imperial:false
  }).addTo(mapTwo);

  mapTwo.fitBounds(layerTwo.getBounds());
}

addLayerTwo('../data/building_footprint_density.geojson');

var legendTwo = L.control({position: 'bottomright'});

legendTwo.onAdd = function () {

  var div = L.DomUtil.create('div', 'legend'),
  
  grades = [0.015, 0.121, 0.171, 0.235, 0.304],
  labels = [];

  div.innerHTML += '<h3>LEGEND</h3>';

  for (var i =0; i < grades.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColourTwo(grades[i]) + '"></i>' +
    grades[i] + (grades[i+1] ? ' &ndash; ' + grades[i+1] + '<br>': '+');
  }

  return div;

}

legendTwo.addTo(mapTwo);