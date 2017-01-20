//generate list of cities and their properties from config.json
$.getJSON("ui-settings.json", function(data) {
  $.each(data, function(key, val) {
    //add the li
    $(".cities").append("<div class='city' id='city-" + key + "'> <div class='text'>" + val["name"] + "</div></div>");
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
});



mapboxgl.accessToken = 'pk.eyJ1IjoibWlyZWlsbGVyYWFkIiwiYSI6ImZSQURPM3cifQ.fivqJpti-Um8m38RMPWzkQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-73.993216, 40.746827],
  zoom: 12,
  pitch: 60
});



map.on('load', function() {
  map.addLayer({
    'id': 'startups',
    'type': 'fill-extrusion',
    'source': {
      'type': 'geojson',
      'data': 'data/' + $('.active').attr("datafile-rootname") + 'all.json'
    },
    'paint': {
      'fill-extrusion-color': {
        'property': 'total',
        'type': 'exponential',
        'stops': [
          [1, "#EC407A"],
          [1500, "#4A148C"]
        ]
      },
      'fill-extrusion-height': {
        'property': 'total',
        'type': 'identity'
      },
      // Make extrusions slightly opaque for see through
      'fill-extrusion-opacity': 0.9
    }
  });
});


$(".cities").on('click', ".city", function() {
  //change which city is active
  $(".city").removeClass("active");
  $(this).addClass("active");
  //fly to destination, i could use pan to to avoid blank map or load map in background
  map.flyTo({
    center: JSON.parse('[' + $(this).attr("center") + ']')
  });
  //set the source of the layer to new city data
  map.getSource("startups").setData('data/' + $('.active').attr("datafile-rootname").trim() + 'all.json');
  years = '<li>' + $(this).attr("years").replace(/,/gi, '</li><li>') + '</li><';
  $("ul#filters").html(years);
});



$(".next").click(function() {
  var $toHighlight = $('.selected').next().length > 0 ? $('.selected').next() : $('ul#filters li').first();
  $('.selected').removeClass('selected');
  $toHighlight.addClass('selected');
  selectedYear = $toHighlight.text().trim();
  $("#year-display").text(selectedYear);
  setYear(selectedYear)
});



$(".prev").click(function() {
  var $toHighlight = $('.selected').prev().length > 0 ? $('.selected').prev() : $('ul#filters li').last();
  $('.selected').removeClass('selected');
  $toHighlight.addClass('selected');
  selectedYear = $toHighlight.text().trim();
  $("#year-display").text(selectedYear);
  setYear(selectedYear)
});

function setYear(yr) {
  map.getSource("startups").setData('data/' + $('.active').attr("datafile-rootname").trim() + yr + '.json');
};