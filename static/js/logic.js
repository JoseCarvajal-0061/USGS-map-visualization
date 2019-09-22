var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function circleSize(mag) {
  return mag * 10
}

//https://leafletjs.com/examples/choropleth/

function getColor(mag){
  return mag > 5 ? "#ff0000":
  mag > 4 ? "#ff6600":
  mag > 3 ? "#ffa500":
  mag > 2 ? "#ffb37e":
  mag > 1 ? "#ffff66":
           "#90ee90";
}
  
d3.json(Url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> + Magnitude:  " +  (feature.properties.mag) + "<p/>" );
    }


    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: circleSize(feature.properties.mag), fillcolor: getColor(feature.properties.mag), fillOpacity: 0.90});
      },
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  

function createMap(earthquakes) {


var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiamxtMjI4MiIsImEiOiJjazByNnAyejMwMzVzM29xaTl4cWVrZGtyIn0.mdu-3nHNyDx1wzYCWLd2Sg"
  });

var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: "pk.eyJ1IjoiamxtMjI4MiIsImEiOiJjazByNnAyejMwMzVzM29xaTl4cWVrZGtyIn0.mdu-3nHNyDx1wzYCWLd2Sg"
  });

var baseMaps = {
    "Street Map": streetmap, 
    "Satelite Map": satelitemap
  };

var overlayMaps = {
    Earthquakes: earthquakes
  };

var myMap = L.map("map", {
    center: [39.8283,-98.5795],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // custom legend control code from  https://leafletjs.com/examples/choropleth/ 

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getcolor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);


  }