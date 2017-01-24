var turf = require('turf');
var grep = require('grep-from-array');
var fs = require('fs');

//get the file name
var param =  process.argv[2];

//read the config file
var yr = fs.readFileSync("../config.json");
yr = JSON.parse(yr);

//filter by parameter name minus .csv
yr = yr.filter( function(obj) { return  obj.name == param.split('.')[0] } );

years = yr[0]["details"]["years"];

var years = years.split(',')

for (var a in years)
{
	min_year =  years[a]


	console.log("year: " + min_year);

	var fname= param.split('.')[0] + min_year + ".json"; 
 
	console.log("- reading geojson");
	var points = fs.readFileSync(param);

	console.log("- parsing points");
	points = JSON.parse(points);

	console.log("- generating a bounding box"); 
	var bbox = turf.extent(points);

	console.log("- creating cute little hex grids");
	var grid = turf.hexGrid(bbox, 0.5);


	console.log("- counting how many points are in each grid and doing summary of other fields, but that is not working yet");


// var aggregations = [

//   {
//     aggregation: 'count',
//     inField: '',
//     outField: 'total'
//   }
//   //,
//   //{
//   //	aggregation: 'sum',
//   //	inField: 'edges_num_interactions',
//   //	outField: 'edges_num_interactions_sum'
//   //}
// ];


//console.log(JSON.stringify(grid, null, 4));


points = turf.filter(points, 'min_year' , min_year );

grid = turf.count(grid, points, 'total') ;


// grid = turf.aggregate(grid, points, aggregations);



console.log("- removing hex grids without data in them"); 

grid = grep(grid.features, function (element, index) {
	return element.properties.total >   0;
});



console.log("- turning the whole thing into a featurecollection");
grid = turf.featurecollection(grid);



console.log("- writing to json file"); 

fs.writeFileSync( fname , JSON.stringify(grid));


console.log('-----------');

}

