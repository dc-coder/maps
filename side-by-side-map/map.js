mapboxgl.accessToken = 'pk.eyJ1IjoibWlyZWlsbGUiLCJhIjoiY2oyMXhxeHEwMDAwODMzbWdmc2pkZzc2MCJ9.dnTlkXT6i4qEy7LygdIhfA';

var beforeMap = new mapboxgl.Map({
    container: 'other-data',
    style: 'mapbox://styles/mireille/cj21xrtf600062slproy6flpd',
    center: [-73.99283409118652, 40.75041060083396],
    zoom: 11
});


var afterMap = new mapboxgl.Map({
    container: 'startup-data',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-73.99283409118652, 40.75041060083396],
    zoom: 11 , 
    preserveDrawingBuffer: true
});


var map = new mapboxgl.Compare(beforeMap, afterMap, {
    // Set this to enable comparing two maps by mouse movement:
});

 


//'mapbox://styles/mireilleraad/cizkf1gk7000p2smzpgrtd6x1'

//mapbox://styles/mireilleraad/cizowikhj005k2smyvk803813


afterMap.on('click', function(e) {
    if ($(".mdl-switch").is(".is-checked")) {
        panorama = new google.maps.StreetViewPanorama(document.getElementById('panorama'), {
            position: {
                lng: e.lngLat.lng,
                lat: e.lngLat.lat
            },
            pov: {
                heading: 0,
                pitch: 0
            },
            addressControl: false,
            linksControl: true, // guide arrows
            panControl: false, // compass
            zoomControl: false,
            /*
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },*/
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            zoom: 1,
            visible: true,
            mode: 'html5' // fixes bug in FF: http://stackoverflow.com/questions/28150715/remove-google-street-view-panorama-effect
        });
    }
});


function setMapData(city) {

    console.log(city);
    if (city == "startup city") { 
        city = "nyc";
    } else 
    {
        afterMap.removeSource("startups");
        afterMap.removeLayer("cluster-1");
        afterMap.removeLayer("cluster-2");
        afterMap.removeLayer("cluster-3");
        afterMap.removeLayer("cluster-4");
        afterMap.removeLayer("cluster-5");
        afterMap.removeLayer("unclustered-points");
        afterMap.removeLayer("cluster-count");
    }
 
 

    afterMap.addSource("startups", {
       
        type: "geojson",
        data: "../data/details/" + city + "-details.csv.min.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 10 // Radius of each cluster when clustering points (defaults to 50)
    });

    
    afterMap.addLayer({
        "id": "unclustered-points",
        "type": "symbol",
        "source": "startups",
        "filter": ["!has", "point_count"],
        "layout": {
            "icon-image": "marker-15"
        }
    });


    var layers = [
        [350, '#0E2E34'],
        [250, '#16544F'],
        [150, '#307D61'],
        [20, '#5FA568'],
        [20, '#9FCC68'],
        [0, '#EFEE69']
    ];


    layers.forEach(function (layer, i) {
 
        afterMap.addLayer({
            "id": "cluster-" + i,
            "type": "circle",
            "source": "startups",
            "paint": {
                "circle-color": layer[1],
                'circle-radius': 10,
                'circle-opacity': 0.8
            },
            "filter": i === 0 ?
                [">=", "point_count", layer[0]] :
                ["all",
                    [">=", "point_count", layer[0]],
                    ["<", "point_count", layers[i - 1][0]]]
        });
    });

   afterMap.addLayer({
        "id": "cluster-count",
        "type": "symbol",
        "source": "startups",
        "layout": {
            "text-field": "{point_count}",
            "text-font": [
                "DIN Offc Pro Medium",
                "Arial Unicode MS Bold"
            ],
            "text-size": 12
        }
    });


}
 
// function getFilteredData() {



// var datafile = "../data/details/nyc-details.csv.min.geojson";

//   $.getJSON( datafile, {
//     format: "json"
//   })
//     .done(function( data ) {
//      var items = [];
//       $.each( data.features, function( i, feature ) {

//         //console.log(feature);

//         if (feature.properties.e == "hosted" ) {
//             items.push(feature);
//         }
       
//       });

//       console.log(items);
//     });

// }

afterMap.on('load' , function() {
 
   

    var city = $("#startup-city-selected").text().toLowerCase();
    setMapData(city);
 

});


 

$("#filter-by-activity").change(function(){

var filters = document.getElementById('filter-by-activity').filters;

var list = [];
    for (var i = 0; i < filters.length; i++) {
        if (filters[i].checked) list.push(filters[i].value);
    }

    console.log(list);
  


});












