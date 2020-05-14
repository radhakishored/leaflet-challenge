//https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02
// Create a map object


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




var data =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
//"geometry":{"type":"Point","coordinates":[-71.620999999999995,-29.888000000000002,40]}
//"properties":{"mag":4,"place":"27km WNW of Coquimbo, Chile","time":1388619735000,"updated":1394151954000


var eq;
var earthquakes =[];
var earthquakes1=[];
var plateData1
var tectonicPlates1=[];

d3.json(tectonicPlatesURL, function(plateData) {
	plateData1= plateData;
});
tectonicPlates1.push(L.geoJson(plateData1, {
				color: "#ff862f",
                weight: 2
            }));

/*d3.json(tectonicPlatesURL, function(plateData) {
        tectonicPlates.push((L.geoJson(plateData, {
                color: "#ff862f",
                weight: 2
            })));
			console.log(tectonicPlates)
           tectonicPlates1=tectonicPlates;
		  
});*/
//console.log(tectonicPlates.length);
console.log(tectonicPlates1)
//layerGroup(tectonicPlates1).addTo(myMap); 

d3.json( data, function(response){
	//console.log(response.fearues);
	L.geoJson(response, {
        onEachFeature: function(feature) {
            
			// Conditionals for data points
   //console.log(feature.properties.mag);
	if (feature.properties.mag  <= 1) {
        color = "#2fff78";
    } else if (feature.properties.mag  <= 2) {
        color = "#c8ff2f";
    } else if (feature.properties.mag  <= 3) {
        color = "#f8ff2f";
    } else if (feature.properties.mag  <= 4) {
        color = "#ffc12f";
    } else if (feature.properties.mag  <= 5) {
        color = "#ff862f";
    } else {
        color = "#ff2f2f";
    };	
	
	// Add circles to map
	Rev_coordinates=[feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
  //console.log(Rev_coordinates);
  earthquakes.push(L.circle(Rev_coordinates,{
	  fillOpacity: 0.75,
      color: "white",
    fillColor: color,
    // Adjust radius
    radius: feature.properties.mag * 15000
  }).bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>"))
	//console.log(earthquakes.length);
	}
	
	});
	L.layerGroup(earthquakes1)
	earthquakes1=earthquakes;
	eq = L.layerGroup(earthquakes1);
	//console.log(earthquakes1.length);
});

//console.log(tectonicPlates.length);
// Create two separate layer groups: one for cities and one for states


tp = L.layerGroup(tectonicPlates1)

// Create a baseMaps object
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create an overlay object
var overlayMaps = {
  "Earthquakes ": eq,
  "TectonicPlates": tp
};

// Define a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [streetmap,eq,tp]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);



 

/* var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap); */



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

       //div.innerHTML='<div class="info legend" style="background=white">'
    for (var i = 0; i < mag.length; i++) {
		//console.log('<i style="background:' + Gradient(mag[i] + 1) + '"></i> ' + legendLabel[i] + "<br/>");
        div.innerHTML +=
            '<i style="background:' + Gradient(mag[i] + 1) + '">O</i> ' + legendLabel[i] + '<br/>' ;
    }
	//div.innerHTML+='</div>'
	console.log(div.innerHTML);
    return div;
};

myMap.addControl(legend);




