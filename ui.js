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
      $("#city-" + key).css('background-image', 'url(' + val["img"] + ')');
    });
  });
  //set the city with selected=1 to active
  $("[loaded=1]").addClass("active");
  years = '<li>' + $("[loaded=1]").attr("years").replace(/,/gi, '</li><li>') + '</li><';
  $("ul#filters").html(years);
  $("ul#filters li:last-child").addClass("selected");
});

$('.infinite-carousel').infiniteCarousel({
  itemsPerMove : 2,
  duration : 500,
  vertical : true
});

mapboxgl.accessToken = 'pk.eyJ1IjoibWlyZWlsbGVyYWFkIiwiYSI6ImZSQURPM3cifQ.fivqJpti-Um8m38RMPWzkQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-73.93951177597046,40.72475450489242],
  zoom: 11.5,
  pitch: 60
});




map.on('load', function() {

  map.addSource("startups", {
    "type": "geojson",
    'data': 'data/hex/' + $('.active').attr("datafile-rootname") + 'all.json'
  });

  map.addLayer({
    'id': 'startups-fill',
    'type': 'fill-extrusion',
    'source': 'startups',
    'paint': {
      'fill-extrusion-color': {
        'property': 'percentage_vis',
        'type': 'exponential',
        'stops': [
        [1, "#EC407A"],
        [2500, "#4A148C"]
        ]
      },
      'fill-extrusion-height': {
        'property': 'percentage_vis',
        'type': 'identity'
      },
      // Make extrusions slightly opaque for see through
      'fill-extrusion-opacity': 0.9
    }
  });


  // map.addLayer({
  //   'id': 'startups-fill-hover',
  //   'type': 'fill-extrusion',
  //   'source': 'startups',
  //   'paint': {
  //     'fill-extrusion-color': {
  //       'property': 'percentage_vis',
  //       'type': 'exponential',
  //       'stops': [
  //         [1, "#EC407A"],
  //         [1500, "#4A148C"]
  //       ]
  //     },
  //     'fill-extrusion-height': {
  //       'property': 'percentage_vis',
  //       'type': 'identity'
  //     },
  //     // Make extrusions slightly opaque for see through
  //     'fill-extrusion-opacity': 0.9
  //   },
  //   "filter": ["==", "percentage_vis", ""]
  // });

  map.addLayer({
    "id": "startups-details", 
    'type': 'circle',
    "source": {
      "type": "geojson",
      'data': 'data/details/' + $('.active').attr("datafile-rootname") + '-details.csv.min.geojson' 
    } ,
    "paint": {
      "circle-opacity" : 0
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

 var markerHeight = feature.properties.percentage_vis, markerRadius = 10, linearOffset = 25;
 
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


});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
// map.on("mousemove", function(e) {

//   if (!map.loaded()) return;

//   // var features = map.queryRenderedFeatures(e.point, {
//   //   layers: ["startups-fill"]
//   // });
//   // if (features.length) {
//   //   map.setFilter("startups-fill-hover", ["==", "percentage_vis", features[0].properties.percentage_vis]);
//   // } else {
//   //   map.setFilter("startups-fill-hover", ["==", "percentage_vis", ""]);
//   // }

// });


// Reset the state-fills-hover layer's filter when the mouse leaves the map
// map.on("mouseout", function() {

//   if (!map.loaded()) return;
//   map.setFilter("startups-fill-hover", ["==", "percentage_vis", ""]);

// });


// var datapoints = [];

// var filterEl = document.getElementsByClassName('selected');
// var listingEl = document.getElementsByClassName('nav-side-desc p');
//  var obj = { };

// function renderListings(features) {
//     // Clear any existing listings
//     listingEl.innerHTML = '';
//     if (features.length) {
//         features.forEach(function(feature) {
//             obj[feature.properties.e] = (obj[feature.properties.e] || 0) + 1; 
//             $.each( obj, function( key, value ) {
//              item = key.substr(0,1).toUpperCase() + key.substr(1) +  "<br> " +  value + "<br><br>";
//             });

//             $(".nav-side-desc p").html(item);
//         });

        
//     } else {
       
//         // remove features filter
//          map.setFilter('startups-details', ['==', 'm', yr]);
//     }
// }


//   map.on('moveend', function() {
//         var features = map.queryRenderedFeatures({layers:['startups-details']});

//         if (features) {
           
//             // Populate features for the listing overlay.
//             renderListings(features);

//             // Clear the input container
//             filterEl.value = '';

             
//         }
//     });




map.on('moveend', function() {   

  yr = $(".selected").text().trim();
  setNavText(yr);



});    



// map.on('source.loading', function (e) {
//   console.log(e.status); // one of 'fetching', 'idle', 'errored'
// });



$(".cities").on('click', ".city", function() {
  //change which city is active
  $(".city").removeClass("active");
  $(this).addClass("active");
  //fly to destination, i could use pan to to avoid blank map or load map in background
  map.easeTo({
    center: JSON.parse('[' + $(this).attr("center") + ']')
  });
  //set the source of the layer to new city data
  map.getSource("startups").setData('data/hex/' + $('.active').attr("datafile-rootname").trim() + 'all.json');
  map.getSource("startups-details").setData('data/details/' + $('.active').attr("datafile-rootname").trim() + '-details.csv.min.geojson');
  years = '<li>' + $(this).attr("years").replace(/,/gi, '</li><li>') + '</li><';
  $("ul#filters").html(years);

});



$(".next-year").click(function() {

  var $toHighlight = $('.selected').next().length > 0 ? $('.selected').next() : $('ul#filters li').first();
  $('.selected').removeClass('selected');
  $toHighlight.addClass('selected');
  selectedYear = $toHighlight.text().trim();

  $(".nav-side-year-display").html(selectedYear);
  setYear(selectedYear);

});



$(".prev-year").click(function() {
  var $toHighlight = $('.selected').prev().length > 0 ? $('.selected').prev() : $('ul#filters li').last();
  $('.selected').removeClass('selected');
  $toHighlight.addClass('selected');
  selectedYear = $toHighlight.text().trim();
  $(".nav-side-year-display").text(selectedYear);
  setYear(selectedYear);
});

function setYear(yr) {



  map.getSource("startups").setData('data/hex/' + $('.active').attr("datafile-rootname").trim() + yr + '.json');
  map.getSource("startups-details").setData('data/details/' + $('.active').attr("datafile-rootname").trim() + '-details.csv.min.geojson');
  

 


};

function setNavText(yr) {


  if (yr =="all"){
     map.setFilter('startups-details', ['>', 'm', '0']);
  }else {
    map.setFilter('startups-details', ['==', 'm', yr]);
  }
  
 

 var obj = { };

  var features = map.queryRenderedFeatures({layers:['startups-details']});   

  if (features) { 

   var obj = { };


   features.forEach(function(feature) {    
          // console.log(feature.properties.e);

          obj[feature.properties.e] = (obj[feature.properties.e] || 0) + 1;


        });        

   
 }   


 $(".nav-side-desc p").html("");

 $.each( obj, function( key, value ) {
  $(".nav-side-desc p").append(key.substr(0,1).toUpperCase() + key.substr(1) +  "<br> " +  value + "<br><br>"); 
});

}