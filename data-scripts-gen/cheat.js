var fs = require('fs');

var param =  process.argv[2];

var fname= param.split('.')[0] + ".json";  


var json = fs.readFileSync(fname);

json = JSON.parse(json);   
 
 function replaceByValue() {
  
    for( var k = 0;  k < json.features.length; ++k ) {

          json.features[k].properties.total_vis = json.features[k].properties.total * 2  ;
           
    }
    return json;
  }
 

json = replaceByValue();

fs.writeFileSync( fname , JSON.stringify(json));

 