library(jsonlite)
library(V8)

# https://github.com/Intellipharm/dc-addons
# https://github.com/austinlyons/dcjs-leaflet-untappd

untappd <- fromJSON("untappd.json")

ct <- v8()
ct$source("https://cdnjs.cloudflare.com/ajax/libs/d3/4.1.1/d3.min.js")
ct$source("http://underscorejs.org/underscore-min.js")
ct$source("https://cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.12/crossfilter.min.js")

ct$assign("data", untappd)
ct$console()

# var beerData = data.response.beers.items;
# var fullDateFormat = d3.time.format('%a, %d %b %Y %X %Z');






