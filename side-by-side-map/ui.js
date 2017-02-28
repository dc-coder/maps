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

    var index = $( "#startup-city-list-items li" ).index( this );
 
    $("#startup-city-selected").text( city) ;

    var center = [ "-73.99283409118652, 40.75041060083396" , "-75.57913541793823, 6.2344611857957375" , "-74.10565853118896,4.6626612070343185"];
   

      afterMap.easeTo({
        center: JSON.parse('[' + center[index] + ']')
    });
    
    
});


$("#secondary-data-set-list .mdl-menu__item").click(function(){
 

    var set = $(this).text();

    var index = $( "#secondary-data-set-list li" ).index( this );
 
    $("#secondary-data-set-selected").text( set) ;

    var le_style = ["mapbox://styles/mireilleraad/cizkf1gk7000p2smzpgrtd6x1" , "mapbox://styles/mireilleraad/cizowikhj005k2smyvk803813"]

   beforeMap.setStyle(le_style[index]);
     
    
});



 


    
