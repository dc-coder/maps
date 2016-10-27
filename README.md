# map
Source for geographic map visualization


Files
--------
Here is an overview of the project files and their descriptions.

    map
    |- README            		# This readme
    |- map-cluster.html  		# Simple clustering of all the data
    |- map-cluster-data.csv     # Data used in map-cluster.html
    |- places-merge.csv 		# Merging Geolocation with comp
    |- rows-with-geolocation.R 	# Generating map-cluster-data.csv
    |- heat-map.html 			# Heat map that uses count of points, colors and circle blur
    |- heat-map-data.geojson 	# The data for heatmap, can be cleaned up.
    |- map-autoplay.html 		# Autoplay of clustered data and different sections of beirut.


Data Transformations
------------------------
- `map-cluster-data.csv`: places.csv, filter data by longitude and remove blanks.

- `heat-map-data.geojson`: upload data to mapbox, re-download as geojson formated for mapbox.

