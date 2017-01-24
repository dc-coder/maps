#!/bin/bash
# convert all .csv to .geojson using mapbox's csv2geojson https://github.com/mapbox/csv2geojson 
# don't forget to make this executable by running: chmod u+x gen.sh 

shopt -s nullglob

cd data/hex

printf "====================================\n Converting the following files: \n==================================== \n"

for f in *.csv
do
	echo "$f"
    csv2geojson "$f" > "$f.geojson"
    minify-geojson -k "$f.geojson"
	node ../../generate-grids.js "$f.geojson"
	node ../../generate-grids-byyear.js "$f.geojson"

done


# clean up files that we don't need

rm *.csv.geojson
rm *.csv.min.geojson

for f in *.json
do
	node ../../cheat.js "$f"
done

cd ../..

cd data/details

for f in *.csv
do
	echo "generating invisible layer for $f"
	csv2geojson "$f" > "$f.geojson"
    minify-geojson -k "$f.geojson"
done

rm *.csv.geojson

printf "========================\n You're welcome \n======================== \n"

 