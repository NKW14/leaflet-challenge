// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Define a function to create a marker for each earthquake
    function onEachFeature(feature, layer) {
      // Create a circle marker for each earthquake
      let magnitude = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];
      let color = depth > 100 ? '#FF0000' : (depth > 50 ? '#FF6600' : '#FFFF00'); // Red, Orange, Yellow gradient based on depth
  
      let radius = magnitude * 3; // Scale the magnitude to a suitable radius for the circle
  
      // Create the circle marker and add it to the map
      L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: radius,
        fillColor: color,
        color: '#000000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km<br>${new Date(feature.properties.time)}</p>`)
        .addTo(myMap);
    }
  
    // Create a map layer for the earthquake markers
    earthquakeData.forEach(feature => {
      onEachFeature(feature);
    });
  
    // Send the map to the createMap function
  }

function createMap() {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
    "Satelite" : googleSat
  };

  // Create an overlay object to hold our overlay.
//   let overlayMaps = {
//     "Earthquake Heatmap": heat
//   };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, {}, {
    collapsed: false
  }).addTo(myMap);
 return myMap;

}

let myMap = createMap();

function addLegend() {
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {
      let div = L.DomUtil.create('div', 'info legend');
      let grades = [0, 10, 30, 50, 70, 90];
      let colors = ['#FFFF00', '#FF6600', '#FF0000', '#990000', '#660000']; 
      
      // Create a legend item for each grade interval
      for (let i = 0; i < grades.length; i++) {
          // Handle the case where there are more grades than colors
          let color = colors[i] || '#FFFFFF'; 

          div.innerHTML +=
              '<i style="background:' + color + '"></i> ' +
              (grades[i] ? (grades[i + 1] ? grades[i] + '&ndash;' + grades[i + 1] + ' km<br>' : grades[i] + '+ km<br>') : '0&ndash;' + grades[0] + ' km<br>');
      }

      return div;
  };

  legend.addTo(myMap);
}

let mylegend = addLegend();