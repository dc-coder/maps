 
var styleDark = 'mapbox://styles/mireilleraad/ciwineqp900012qnxvyim821a';

mapboxgl.accessToken = 'pk.eyJ1IjoibWlyZWlsbGVyYWFkIiwiYSI6ImZSQURPM3cifQ.fivqJpti-Um8m38RMPWzkQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: styleDark,
    center: [ -74.00753454589844, 40.717512262248604],
    zoom: 13,
    pitch: 60
});

 

// disable scroll if it's embedded in a blog post
if (window.location.search.indexOf('embed') !== -1 ) {
    map.scrollZoom.disable();
};



var colorStops = ["#151515", "#222", "#FDA400", "#ff8d19", "#ff5733", "#ff2e00"];
var heightStop = 5000;
var colorActive = "#78009C";
var typeList = ["total"];
// for DDS threshholds, [total, density]
var max = {
    
    "total": 500
};

var empty = {
    "type": "FeatureCollection",
    "features": []
};

var gridActive = {
    "type": "FeatureCollection",
    "features": []
};
var pointActive = {
    "type": "FeatureCollection",
    "features": []
};
var previousCamera = {};

// active filter for each of the filter session
var activeCamera = "hexbin";
var activeType = "total";
// result data field of camera, type, method combined
var activeDDS = "total";
var maxColor = max[activeDDS];
var maxHeight = max["total"];

 

var grids = gridsRaw;

map.on('load', function() {

    map.addControl(new mapboxgl.NavigationControl({position: 'top-right'}));
    // addCustomControl();

    addLayers();
 
    map.on("zoom", function() {
        if (activeCamera !== "inspector") {
            var zoom = map.getZoom();
            activeCamera = zoom>14 ? "dotted" : "hexbin";
            setLayers();
        };
    });

 
   

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: 'top',
    });
    // tooltip
    map.on("mousemove", function(e) {
        var coordinates = [e.lngLat.lng, e.lngLat.lat];
        var html = "";
        map.on("zoom", function() {
            return;
        });
        if (activeCamera==="hexbin") {
            
            var query = map.queryRenderedFeatures( e.point, {layers: ["grids-3d"]} );

            if (query.length) {
               
                gridActive.features = [query[0]];
                map.getSource('grid-active').setData(gridActive);
            } else {
                map.getSource('grid-active').setData(gridActive);
            }; 
        // else: "dotted" or "inspector"
        } 

        if (html==="") {
            popup.remove();
            $(".mapboxgl-canvas-container").css("cursor","-webkit-grab");
        } else {
            $(".mapboxgl-canvas-container").css("cursor","none");
            popup.setLngLat(coordinates)
                .setHTML(html)
                .addTo(map);            
        };
    });

    // drill down a hexbin
    map.on('click', function(e) {
        if (activeCamera==="hexbin") {
            var query = map.queryRenderedFeatures( e.point, {layers: ["grids-3d"]} );
            // it's the same hexbin as the current highlight
            if (query.length && query[0].properties.id === gridActive.features[0].properties.id) {
                // UI changes
                $("#back").show();

                // prepare layers
                activeCamera = "inspector";
                setLayers();

                // Camera
                getCamera();
                var center = turf.center(gridActive);
                map.flyTo({center: center.geometry.coordinates, zoom: 15, pitch: 0});                  
            }; 
        };
    });
    // resume to overview
    $("#back").click(function() {
        
        activeCamera = "hexbin"; 
        // exception: only for inspector > hexbin case
        map.setPaintProperty('grid-active', 'fill-extrusion-height', {
            property: activeDDS,
            stops: [
                [0, 0],
                [maxHeight, heightStop]
            ]
        });       
        setLayers();

        map.flyTo(previousCamera);
        
        $(this).hide();
    });

     

    function addLayers() {

        map.addSource("grids", {
            "type": "geojson",
            "data": grids 
           
        });
        // grid-3d
        map.addLayer({
            "id": "grids-3d",
            "type": "fill-extrusion",
            "source": "grids",
            "paint": {
                "fill-extrusion-color": {
                    property: activeDDS,
                    stops: [
                        [0, colorStops[1]],
                        [maxColor*.2, colorStops[2]],
                        [maxColor*.5, colorStops[3]],
                        [maxColor*.8, colorStops[4]],
                        [maxColor, colorStops[5]]
                    ]
                },
                // "fill-extrusion-opacity": .6,
                "fill-extrusion-height": {
                    property: activeDDS,
                    stops: [
                        [0, 0],
                        [maxHeight, heightStop]
                    ]
                },
                "fill-extrusion-opacity": .9,
                "fill-extrusion-height-transition": { duration: 1000 },
                "fill-extrusion-color-transition": { duration:1000 }
            }
        });


        map.addSource("grid-active", {
            "type": "geojson",
            "data": gridActive
        });
        // add highlight
        map.addLayer({
            "id": "grid-active",
            "type": "fill-extrusion",
            "source": "grid-active",
            "paint": {
                "fill-extrusion-color": colorActive,
                "fill-extrusion-opacity": .6,
                "fill-extrusion-height": {
                    property: activeDDS,
                    stops: [
                        [0, 0],
                        [maxHeight, heightStop]
                    ]
                },
                "fill-extrusion-height-transition": { duration: 1500 },
                "fill-extrusion-color-transition": { duration:1500 }
            }
        });

       
 

        // subtle labels to show count by grid for 2D
        map.addLayer({
            "id": "grids-count",
            "type": "symbol",
            "source": "grids",
            "layout": {
                "text-field": "{"+ activeDDS + "}",
                "text-size": 14
            },
            "paint": {
                "text-color": colorStops[2],
                "text-opacity": 0

            }
        })

        map.addSource("point-active", {
            "type": "geojson",
            "data": pointActive
        });
       
    };

    function setLayers() {
        popup.remove();

         console.log(activeCamera);

        if (activeCamera === "hexbin") {
           
             map.setPaintProperty('grids-count', 'text-opacity' , 0);
            // map.setPaintProperty('grids-3d', 'fill-extrusion-opacity', 0.6);
            // map.setPaintProperty('grid-active', 'fill-extrusion-opacity', 0.6);
            // map.setPaintProperty('grids-count', 'text-opacity', 0);
            map.getSource('point-active').setData(empty);
        } else if (activeCamera === "dotted") {
          
            // map.setPaintProperty('grids-3d', 'fill-extrusion-opacity', 0);
            // map.setPaintProperty('grid-active', 'fill-extrusion-opacity', 0);
            // map.setPaintProperty('grids-count', 'text-opacity', 0.8);
            map.getSource('grid-active').setData(empty);
        } else if (activeCamera === "inspector") {
           
            // map.setPaintProperty('grids-3d', 'fill-extrusion-opacity', 0);
            // map.setPaintProperty('grid-active', 'fill-extrusion-opacity', 0.2);
            map.setPaintProperty('grid-active', 'fill-extrusion-height', 0);
            map.setPaintProperty('grids-count', 'text-opacity', 0.8);
        };

        // set legend
        // if it's dotted, it's the same as dotted
        var camera = activeCamera==="inspector" ? "dotted" : activeCamera;
      
        $("#style-"+camera).show();
    };

    function setDDS () { 

        maxColor = max[activeDDS];
        maxHeight = $("#density").is(":checked")? max["total"] : max["total"];

        map.setPaintProperty('grids-3d', 'fill-extrusion-color', {
                property: activeDDS,
                stops: [
                    [0, colorStops[1]],
                    [maxColor*.2, colorStops[2]],
                    [maxColor*.5, colorStops[3]],
                    [maxColor*.8, colorStops[4]],
                    [maxColor, colorStops[5]]
                ]
            });
        map.setPaintProperty('grids-3d', 'fill-extrusion-height', {
                property: activeDDS,
                stops: [
                    [0, 0],
                    [maxHeight, heightStop]
                ]
            });
        map.setLayoutProperty('grids-count', 'text-field', '{'+activeDDS+'}');

        // if inside inspector, don't change height
        if (activeCamera==="hexbin") {
            map.setPaintProperty('grid-active', 'fill-extrusion-height', {
                property: activeDDS,
                stops: [
                    [0, 0],
                    [maxHeight, heightStop]
                ]
            });        
        };

        // update max number in legend
        $(".label.max").html(maxColor);
    };

    function getCamera () {
        // if pitch==0, don't update Camera
        if (map.getPitch()) {
            previousCamera.center = map.getCenter();
            previousCamera.zoom = map.getZoom();
            previousCamera.pitch = map.getPitch();
            previousCamera.bearing = map.getBearing();
        };
    };
});
