var turf = require('turf');
var grep = require('grep-from-array');
var fs = require('fs');

var param =  process.argv[2];

var fname= param.split('.')[0] + "all.json"; 

console.log("- reading geojson");
var input = fs.readFileSync(param);

console.log("- parsing input");
input = JSON.parse(input);
 
console.log("- generating a bounding box"); 
var bbox = turf.extent(input);

console.log("- creating cute little hex grids");
var grid = turf.hexGrid(bbox, 0.5);

console.log("- counting how many points are in each grid");
grid = turf.count(grid, input, 'total') ;
 

console.log("- removing hex grids without data in them"); 
grid = grep(grid.features, function (element, index) {
	return element.properties.total >   0;
});

console.log("- turning the whole thing into a featurecollection");
grid = turf.featurecollection(grid);
 

console.log("- writing to json file"); 
fs.writeFileSync( fname  , JSON.stringify(grid));

console.log('-----------');
