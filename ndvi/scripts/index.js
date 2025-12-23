var map = L.map('map').setView([52,6], 13);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
).addTo(map);

function getColorOne(d) {
    return d > 51.543 ? '#006837':
           d > 44.894 ?  '#51b35e':
           d > 41.928 ? '#84ca66':
           d > 31.08 ? '#addc6f':
           d > 12.902 ? '#fff6b0':
                        '#a50026';
}

function styleOne(feature) {
    return {
        fillColor: getColorOne(feature.properties.bikeway_density),
        weight: 2,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7
    };
}

async function addLayerOne(url) {
    const response = await fetch(url);
    const data = await response.json();

    const layer = L.geoJSON(data, {style: styleOne}).addTo(map);
    map.fitBounds(layer.getBounds());
}

addLayerOne('../data/bike_lane_density.geojson');

function getColorTwo(d) {
    return d > 0.304 ? '#a50026':
           d > 0.235 ? '#f8864f':
           d > 0.171 ? '#feca79':
           d > 0.121 ? '#fff2aa':
           d > 0.015 ? '#c7e77f':
                       '#006837';
}

function styleTwo(feature) {
    return {
        fillColor: getColorTwo(feature.properties.building_footprint_density),
        weight: 2,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7
    };
}

async function addLayerTwo(url) {
    const response = await fetch(url);
    const data = await response.json();

    const layer = L.geoJSON(data, {style: styleTwo}).addTo(map);
    map.fitBounds(layer.getBounds());
    
}

addLayerTwo('data/building_footprint_density.geojson');