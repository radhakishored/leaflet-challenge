var data =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Define arrays to hold created city and state markers
var earthquakes = [];
var cityMarkers = [];
//var earthquakes1 = [];
//var states;
// Create two separate layer groups: one for cities and one for states
var earthquakes = L.layerGroup();
var tectonicplates = L.layerGroup();

d3.json(data,  generateEQMarkers);

function generateEQMarkers(jsondata) {
      var features = jsondata['features'];
	  for (var i = 0; i < features.length; i++) {
		
		if (features[i].properties.mag  <= 1) {
			color = "#2fff78";
		} else if (features[i].properties.mag  <= 2) {
			color = "#c8ff2f";
		} else if (features[i].properties.mag  <= 3) {
			color = "#f8ff2f";
		} else if (features[i].properties.mag  <= 4) {
			color = "#ffc12f";
		} else if (features[i].properties.mag  <= 5) {
			color = "#ff862f";
		} else {
			color = "#ff2f2f";
		};
		// Add circles to map
		Rev_coordinates=[features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
		L.circle(Rev_coordinates,{
										fillOpacity: 0.75,
										color: "white",
										fillColor: color,
										// Adjust radius
										radius: features[i].properties.mag * 15000
										}).bindPopup("<h3>" + features[i].properties.place + "</h3><hr><p>" + new Date(features[i].properties.time) + "</p>" + "<p> Magnitude: " + features[i].properties.mag + "</p>").addTo(earthquakes)  
	  };
	  
    }


d3.json(tectonicPlatesURL, function(plateData) {
        L.geoJson(plateData, {
                color: "#ff862f",
                weight: 2
            }).addTo(tectonicplates);
});



// Define variables for our base layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});




// Create a baseMaps object
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create an overlay object
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonicplates": tectonicplates
};

// Define a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [streetmap, earthquakes, tectonicplates]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


function Gradient(mag) {
  return mag <= 1?"#2fff78": 
         mag <= 2?"#c8ff2f": 
         mag <= 3?"#f8ff2f": 
         mag <= 4?"#ffc12f": 
         mag <= 5?"#ff862f": 
		 "#ff2f2f";
                 
}
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        mag = [1,2, 3, 4, 5,6],
        legendLabel = ["<1", "1-2", "2-3", "3-4","4-5",">5"];

    for (var i = 0; i < mag.length; i++) {
		//console.log('<i style="background:' + Gradient(mag[i] + 1) + '"></i> ' + legendLabel[i] + "<br/>");
        div.innerHTML +=
            '<i style="align:center;background:' + Gradient(mag[i] + 1) + '"></i>' + legendLabel[i] + '<br/>' ;
    }
	
	console.log(div.innerHTML);
    return div;
};

myMap.addControl(legend);