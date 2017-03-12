//generate list of cities and their properties from config.json
$.getJSON("ui-settings.json", function(data) {

  $.each(data, function(key, val) {
    //add the li
    $(".cities").append("<div class='city item' id='city-" + key + "'> <div class='text'>" + val["name"] + "</div></div>");

    //loop and add each attribute 
    $.each(val, function(attr) {
      //generate the custom attributes
      $("#city-" + key).attr(attr, val[attr]);
      //set the background image      
    });
  });

  //set the city with selected=1 to active
  $("[loaded=1]").addClass("active");
  years = '<li>' + $("[loaded=1]").attr("years").replace(/,/gi, '</li><li>') + '</li><';
  $("ul#filters").html(years);
  $("ul#filters li:last-child").addClass("selected");

});

 
mapboxgl.accessToken = 'pk.eyJ1IjoibWlyZWlsbGVyYWFkIiwiYSI6ImZSQURPM3cifQ.fivqJpti-Um8m38RMPWzkQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-73.99283409118652, 40.75041060083396],
  zoom: 11.5,
  pitch: 60
});

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

 
map.on('load', function() {

  map.addSource("startups", {
    "type": "geojson",
    'data': '../data/hex/' + $('.active').attr("datafile-rootname") + 'all.json'
  });

  map.addLayer({
    'id': 'startups-fill',
    'type': 'fill-extrusion',
    'source': 'startups',
    'paint': {
      'fill-extrusion-color': {
        'property': 'total_vis',
        'type': 'exponential',
        'stops': [
        [1, "#EC407A"],
        [2500, "#4A148C"]
        ]
      },
      'fill-extrusion-height': {
        'property': 'total_vis',
        'type': 'identity'
      },
      // Make extrusions slightly opaque for see through
      'fill-extrusion-opacity': 0.9
    }
  });


});

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

// When a click event occurs near a polygon, open a popup at the location of
// the feature, with description HTML from its properties.
map.on('mousemove', function(e) {

  if (!map.loaded()) return;

  var features = map.queryRenderedFeatures(e.point, {
    layers: ['startups-fill']
  });

  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';


  if (!features.length) {
   popup.remove();
   return;
 }
 


 var feature = features[0];

 var markerHeight = feature.properties.total_vis, markerRadius = 10, linearOffset = 25;
 
  // I need to fix the offsets of the popup... so each one shows based on where the marker height is
  // Also need to close the marker when navigating the year or moving on the map.
  // Popup only closes when another one is opened. try popup.remove again.
  // var popupOffsets = {
  //  'top': [0, 0],
  //  'top-left': [0,0],
  //  'top-right': [0,0],
  //  'bottom': [0, - markerHeight  ],
  //  'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  //  'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  //  'left': [markerRadius, (markerHeight - markerRadius) * -1],
  //  'right': [-markerRadius, (markerHeight - markerRadius) * -1]
  //  };
  // var popup = new mapboxgl.Popup({offset:popupOffsets})

 
  popup.setLngLat(map.unproject(e.point));
  popup.setHTML("<div class='popup-text'>startup activity<br>" + feature.properties.total + "</div>");
  popup.addTo(map);

  console.log(feature);

});

   


$(".cities").on('click', ".city", function() {
  //change which city is active
  $(".city").removeClass("active");
  $(this).addClass("active");
  $("#current-year").text("");

  //fly to destination, i could use pan to to avoid blank map or load map in background
  map.easeTo({
    center: JSON.parse('[' + $(this).attr("center") + ']')
  });
  //set the source of the layer to new city data
  map.getSource("startups").setData('../data/hex/' + $('.active').attr("datafile-rootname").trim() + 'all.json');
  
  years = '<li>' + $(this).attr("years").replace(/,/gi, '</li><li>') + '</li><';
  $("ul#filters").html(years);

});

 

$("#play-pause-year").click(function() {






 if( $("#play-pause-year").text() == "play_arrow") {
   
    $("#play-pause-year").text("pause_arrow");
    
laInterval = setInterval(function(){

   var $toHighlight = $('.selected').next().length > 0 ? $('.selected').next() : $('ul#filters li').first();
    $('.selected').removeClass('selected');
    $toHighlight.addClass('selected');
    selectedYear = $toHighlight.text().trim();
    if (selectedYear =="all") {
      clearInterval(laInterval);
    }
    setYear(selectedYear);
    $("#current-year").text(selectedYear);
   }, 1000);
  
 } else {
  clearInterval(laInterval);
   $("#play-pause-year").text("play_arrow");
    
  
    console.log("stop ya");
 }



}) 

function setYear(yr) {
 

  map.getSource("startups").setData('../data/hex/' + $('.active').attr("datafile-rootname").trim() + yr + '.json');
  

};