L.mapbox.accessToken = 'pk.eyJ1IjoibWlyZWlsbGVyYWFkIiwiYSI6ImZSQURPM3cifQ.fivqJpti-Um8m38RMPWzkQ';


var map = L.mapbox.map('map-lebanon')
    .setView([33.8938408, 35.5140457], 13)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mireilleraad/civflnzxz00082immv868qhwk'));

map.scrollWheelZoom.disable();

var overlays = L.layerGroup().addTo(map);

// we create the 'layers' variable outside of the on('ready' callback
// so that it can be accessible in the showData function. Otherwise,
// JavaScript scope would prevent from accessing it.
var layers;

var points = omnivore.csv('data/lebanon.data.csv', {




});

var markers;
var filters;

// Since featureLayer is an asynchronous method, use the `.on('ready'`
// call to only use its marker data once we know it is actually loaded.
L.mapbox.featureLayer()

points.on('ready', function(e) {
    layers = e.target;
    var filters = document.getElementById('filters').filters;

    var list = [];
    for (var i = 0; i < filters.length; i++) {
        if (filters[i].checked) {
            list.push(filters[i].value);
        }
    }

    showData(list, "activity");
});



$("#filters input").click(function() {


        var filters = document.getElementById('filters').filters;

        var list = [];
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].checked) {
                list.push(filters[i].value);
            }
        }


        showData(list, "activity");

    })
    // There are many ways to filter data. Mapbox.js has the .setFilter method,
    // but it only applies to L.mapbox.featureLayer layers, and that isn't what
    // we're creating - we're making marker groups in a MarkerClusterGroup layer.
    // so the filtering happens in an 'if' statement
    // in a loop. to test on large data.
function showData(list, field) {
    // first collect all of the checked boxes and create an array of strings


    // then remove any previously-displayed marker groups
    overlays.clearLayers();
    // create a new marker group
    var clusterGroup = new L.MarkerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 15,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true
    }).addTo(overlays);



    // and add any markers that fit the filtered criteria to that group.
    layers.eachLayer(function(layer) {
        layer.setIcon(L.icon({
            iconUrl: 'images/pin-startup.png',
            iconSize: [35, 35]
        }));



        if (list.indexOf(layer.feature.properties.administrative_area_level_1) !== -1 && field == "region") {
            clusterGroup.addLayer(layer);
        }

        if (list.indexOf(layer.feature.properties.labelstat) !== -1 && field == "activity") {
            clusterGroup.addLayer(layer);






        }
    });
}



//Different button clicks

$("#all-lebanon").click(function() {

    map.setView([33.8938408, 35.5140457], 9)
    overlays.clearLayers();

    var clusterGroup = new L.MarkerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 15,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true
    }).addTo(overlays);

    layers.eachLayer(function(layer) {
        layer.setIcon(L.icon({
            iconUrl: 'images/pin-startup.png',
            iconSize: [35, 35]

        }));

        clusterGroup.addLayer(layer);


    });


});


$("#mount-lebanon").click(function() {

    map.setView([33.8938408, 35.5140457], 11)

    var list = [];

    list.push("Mount Lebanon", "Gouvernorat du Mont-Liban", "جبل لبنان", "Mount Lebanon", "Jabal Lubnan", "Mount Lebanon Governorate");



    showData(list, "region");


});

$("#beirut").click(function() {

    map.setView([33.8938408, 35.5140457], 13)

    var list = [];

    list.push("Beirut", "محافظة بيروت", "Gobernación de Beirut", "Beirut Governorate", "بيروت", "Gouvernorat de Beyrouth");



    showData(list, "region");


});