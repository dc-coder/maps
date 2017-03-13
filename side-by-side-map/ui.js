$("#opacity-control").on('input', function() {

	var opacity = $(this).val()/100;
 
	$("#startup-data").css("opacity", opacity);


});

$("#switch-street-view").change(function() {
    if ($(".mdl-switch").is(".is-checked")) {
        $("#startup-data canvas").css("cursor", "pointer");
        $("#panorama").html("");
    } else {
        $("#startup-data canvas").css("cursor", "crosshair");
    }
});


 
$("#startup-city-list-items .mdl-menu__item").click(function(){
 
    var city = $(this).text();
    var city_file = $(this).attr("data");

    var index = $( "#startup-city-list-items li" ).index( this );
 
 	$("#panorama").html("");
    $("#startup-city-selected").text( city) ;

    var center = [ "-73.99283409118652, 40.75041060083396" , "-75.57913541793823, 6.2344611857957375" , "-74.10565853118896,4.6626612070343185"];
   

      afterMap.easeTo({
        center: JSON.parse('[' + center[index] + ']')
    });
    
    changeLegend(  $("label#startup-city-selected").text() , $("label#secondary-data-set-selected").text() );
     
    setMapData(city_file);
	



});


$("#secondary-data-set-list .mdl-menu__item").click(function(){
 

    var set = $(this).text();
  

    var index = $( "#secondary-data-set-list li" ).index( this );

	$("#panorama").html("");
    $("#secondary-data-set-selected").text( set) ;

    var le_style = ["mapbox://styles/mireilleraad/cizkf1gk7000p2smzpgrtd6x1" , "mapbox://styles/mapbox/satellite-streets-v9" , "mapbox://styles/mireilleraad/cizxee66j00402ss1cdn5zu0q", "mapbox://styles/mireilleraad/cizowikhj005k2smyvk803813" , "mapbox://styles/mireilleraad/cj073aftd005k2rpof9o10pux"]

    if (set =="Land Cover") {
    	beforeMap.setZoom(13);
    }
   beforeMap.setStyle(le_style[index]);


   changeLegend(  $("label#startup-city-selected").text(), $("label#secondary-data-set-selected").text());
     
    
});


function changeLegend(city, compareto) {
    
    console.log(city);
    console.log(compareto);

	if ( (city == "New York" || city =="Startup City") && compareto =="Population Density") {
		$("#nyc-pop").show()
	} else {
		$("#nyc-pop").hide()
	}

	if ( (city == "New York" || city =="Startup City") && compareto =="Congestion") {
		$("#congestion").show()
        $("#road-network").hide()
	} else {
		$("#congestion").hide()
	}

    if ( compareto =="Road Network") {
        $("#road-network").show()
        $("#congestion").hide()
    } else {
        $("#road-network").hide()
    }

}
 


    
