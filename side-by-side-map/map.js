mapboxgl.accessToken = 'pk.eyJ1IjoibWlyZWlsbGVyYWFkIiwiYSI6ImZSQURPM3cifQ.fivqJpti-Um8m38RMPWzkQ';

var beforeMap = new mapboxgl.Map({
    container: 'other-data',
    style: 'mapbox://styles/mireilleraad/cizowikhj005k2smyvk803813',
    center: [-73.99283409118652, 40.75041060083396],
    zoom: 11
});


var afterMap = new mapboxgl.Map({
    container: 'startup-data',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-73.99283409118652, 40.75041060083396],
    zoom: 11
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
            zoom: 2,
            visible: true,
            mode: 'html5' // fixes bug in FF: http://stackoverflow.com/questions/28150715/remove-google-street-view-panorama-effect
        });
    }
});


afterMap.on('load' , function() {


    afterMap.addSource("nyc-startups", {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: "../data/details/nyc-details.csv.min.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 10 // Radius of each cluster when clustering points (defaults to 50)
    });

    // Use the earthquakes source to create five layers:
    // One for unclustered points, three for each cluster category,
    // and one for cluster labels.
    afterMap.addLayer({
        "id": "unclustered-points",
        "type": "symbol",
        "source": "nyc-startups",
        "filter": ["!has", "point_count"],
        "layout": {
            "icon-image": "marker-15"
        }
    });

    // Display the earthquake data in three layers, each filtered to a range of
    // count values. Each range gets a different fill color.

    var layers = [
        [350, '#0E2E34'],
        [250, '#16544F'],
        [150, '#307D61'],
        [20, '#5FA568'],
        [20, '#9FCC68'],
        [0, '#EFEE69']
    ];

    // var size = [
    //     [350, '20'],
    //     [250, '15'],
    //     [150, '10'],
    //     [20, '5'],
    //     [20, '3'] 
    // ];


    layers.forEach(function (layer, i) {
        afterMap.addLayer({
            "id": "cluster-" + i,
            "type": "circle",
            "source": "nyc-startups",
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
        "source": "nyc-startups",
        "layout": {
            "text-field": "{point_count}",
            "text-font": [
                "DIN Offc Pro Medium",
                "Arial Unicode MS Bold"
            ],
            "text-size": 12
        }
    });



});