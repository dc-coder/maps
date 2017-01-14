#Map Visualization


#### Export csv from MySQL

Generate one file for every city, any mysql dump command would do.


#### csv to geojson to hexgrids

`npm install`

`chmod u+x run.sh`

`./run.sh`

#### Grid to map

Using mapbox gl js for 3d features.

Showing the grid data and an invisible layer of markers. The invisible layer of markers has the data that shows on clicking and panning.


#### How it works

- csv2geojson by mapbox is used to transform csv to  geojson data.
- minify-geojson is used to compress the geojson output
- turfjs is used to:
	- find a bounding box bordering all the data points
	- generate hexgrids inside that bouding box (can also generate squares)
	- count the points in each grid
- grep-from-array is used to remove hexgrids where we have no points (makes data size smaller)
- save to json file 


<!-- `minify-geojson -k "$f.geojson"`



 -->