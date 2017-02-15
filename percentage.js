var fs = require('fs');

var param =  process.argv[2];

console.log(param);

var fname= param.split('.')[0] + ".json";  

var json = fs.readFileSync(fname);

json = JSON.parse(json);   
 
  function getTotal() {
 	 file_total = 0;
 	 for( var k = 0;  k < json.features.length; ++k ) { 
 	 	file_total = file_total + json.features[k].properties.total;
 	 }

 	 return file_total;
 }

file_total = getTotal();

console.log(file_total);

 function replaceByValue() {
  
    for( var k = 0;  k < json.features.length; ++k ) {

          json.features[k].properties.percentage_vis = 100 * ((100 * json.features[k].properties.total) /file_total);
           
    }
    return json;
  }
 


json = replaceByValue();

fs.writeFileSync( fname , JSON.stringify(json));

 