## Map visualizations


So far there are 2 main visualizations: Hexgrid and side by side comparison. 

The cities are: NYC, Bogota and Medellin. Other cities were dropped from the vis due to lack of data.


### Hexgrids map

Using hexgrids to visualize the startup activity in a city over time.

### Side by Side Map

Clustering startup activity in a city and overlaying it with demographic, economic and other datasets.


### Folder Structure
--------

    project
    |- data/          		# Where all data lives.
    |     |- details/       # The detailed data in each map, csv files and minified geojson. csv are downloaded, scripts generates geojson 
    |     |- hex/           # The summary data in hex grids, generated from the previous folder
    |     |- other-data/    # Other datasets or general stats used to compare startup data to other indicators. 
    |- data-scripts-gen     # The automated scripts that do any data transformation
    |- hexgrids             # First data visualization that shows startup activity over time in hexgrids.
    |- scratch      		# All the tests and beta files.
    |- videos/           	# Videos or screen recordings of how things work, mostly for presentations or to share with colleagues so they don't have to run code.
   


