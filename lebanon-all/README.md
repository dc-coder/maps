## About

Mapbox map with geo-located data from lebanon


## Notes
We've agreed that for webpage loading speeds, it is better to create country specific csv files. I've assumed that this is the case - so the map reads from a csv inside the folder (instead of going to a csv/master). This is still one line of code, which is easy to change.

The csv has lebanon only data and rows where geolocation is not empty. (which cuts down the size of file by a lot)


## To do

- Add an interactive chart that shows statistics about the markers in view - what charts could we use?
- Decide if marker data can be confidential - based on that see if any data about single markers is shown
- Add an interaction or data summary when a single cluster is selected


## Preview

https://boostingecosystems.github.io/map/lebanon-all/

<img width="800" alt="screen shot 2016-11-30 at 5 47 28 pm" src="https://cloud.githubusercontent.com/assets/521705/20774621/202359bc-b725-11e6-8475-e95109c6532d.png">
