#Map Visualization


#### Export csv from MySQL

MySQL command:

To generate hexes:

    1- `select  * from map where map_city='xxxx'`
    2- save output to data/hex as cityname.csv

To generate the details of each data (invisible layer)

    1- `select min_year, map_city, places_longitude as longitude ,places_latitude as latitude ,edges_label from map where  map_city = 'xxx'`
    2-  save output to data/details as cityname-details.csv


#### csv to geojson to hexgrids
`npm install -g csv2geojson`
`npm install -g minify-geojson`
`npm install`

`chmod u+x run.sh`

`./run.sh`

### configure ui-settings.js

```json
{
    "name": "beirut",
    "img": "img/beirut-dark.jpg",
    "datafile-rootname": "beirut",
    "years": "1995,2002,2004,2007,2009,2010, 2011, 2012, 2013,2014,2015,2016,all",
    "max_height": "200px",
    "color_stops": "#Ff00ff",
    "loaded": 0,
    "center": "35.501629 , 33.891704"
  }
```
- name: city name, unique, don't include spaces. (consider it as variable name)
- img: the background image or preview of each city
- the data file rootname: for evercity, there are 3 types of files generated:
	- cityall.json (has all the hexgrids and the totals)
	- cityyear.json (has a specific year of data, example nyc2015.json)
	- citydetails.json (the individual rows/points in the data - this layer is added as invisible and will be used to   generate summaries of data or to animate it later on)
- years: is the list of years that should be shown in the years navigation
- max_height: what is the maximum height of the bars (not being used now)
- color_stops: color mode is exponential, between 2 numbers, a color can be assigned and it will change as numbers increase. Different color stops can be identified for different cities.
- loaded: a flag to identify is data for the city has been loaded and avoid reloading data multiple times.
- center: what is the center of city? used to set the flyTo location
	
  
  
#### Grid to map

Steps to show data on the map include:

- Using mapbox gl js for 3d extrusion features.
- Adding an invisible layer of markers that has all the points. It is used to summarize what the reader sees. This layer is added after everything else has loaded.
- Using a cheat.js script to get increase the height of data * 3 - there are 2 values generated:
    - total: the actual total that we use for counting and display in marker popup.
    - total_vis: the total used for visualizing and for the extrusion heights.

#### How it works

##### STEP 1
- csv2geojson by mapbox is used to transform csv to  geojson data.
- minify-geojson is used to compress the geojson output
- turfjs is used to:
	- find a bounding box bordering all the data points
	- generate hexgrids inside that bouding box (can also generate squares)
	- count the points in each grid
- grep-from-array is used to remove hexgrids where we have no points (makes data size smaller)
- save to json file 

##### STEP 2
- read the config file, get all the years in each city
- subset data in each city per year and regnerate using STEP 1.

##### STEP 3
- read all the csv in "details", generate a geojson for invisible layer.

<!-- `minify-geojson -k "$f.geojson"`
 -->

### To Do

A lot of things ;p

