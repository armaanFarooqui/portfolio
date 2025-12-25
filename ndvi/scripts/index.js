/// Map 1



var mapOne = L.map('mapOne');

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapOne);

async function addLayerOne(url) {
  const response = await fetch(url);
  const data = await response.arrayBuffer();

  const georaster = await parseGeoraster(data);

  const layer = new GeoRasterLayer({
    georaster,
    opacity: 0.7,
    resolution: 256,
    
    pixelValuesToColorFn: (values) => {
      
      const v = values[0];

      return v > 1.0 ? '#006837':
             v > 0.6 ? '#36a657':
             v > 0.4 ? '#93d168':
             v > 0.2 ? '#e8f59f':
             v > 0.0 ? '#fece7c':
             v > -9999 ? '#a50026':
                        null;
    }

  });

  layer.addTo(mapOne);
  mapOne.fitBounds(layer.getBounds());
}

addLayerOne('../data/ndvi_composite.tif');



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
    opacity: 0.7,
    resolution: 256,

    pixelValuesToColorFn: (values) => {
      
      const v = values[0];

      return v > 1.0 ? '#a50026':
             v > 0.6 ? '#fece7c':
             v > 0.4 ? '#e8f59f':
             v > 0.2 ? '#93d168':
             v > 0.0 ? '#36a657':
             v > -9999 ? '#006837':
                        null;
    }
  });

  layer.addTo(mapTwo);
  mapTwo.fitBounds(layer.getBounds());

}

addLayerTwo('../data/ndbi_composite.tif');