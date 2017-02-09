library(V8)

# Create a new context
ct <- v8()

# Evaluate some code
ct$eval("var foo = 123")
ct$eval("var bar = 456")
ct$eval("foo + bar")

# Create some JSON
cat(ct$eval("JSON.stringify({x:Math.random()})"))

# Simple closure
ct$eval("(function(x){return x+1;})(123)")

ct$source("http://underscorejs.org/underscore-min.js")
ct$source("https://cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.12/crossfilter.min.js")

# data interchange between R and JavaScript
ct$assign("mydata", mtcars)
ct$get("mydata")

ct$call("_.filter", mtcars, JS("function(x){return x.mpg < 15}"))

# interactive console
data(diamonds, package = "ggplot2")
ct$assign("diamonds", diamonds)
ct$console()

# var cf = crossfilter(diamonds)
# var price = cf.dimension(function(x){return x.price})
# var depth = cf.dimension(function(x){return x.depth})
# price.filter([2000, 3000])
# output = depth.top(10)

output <- ct$get('output')

# console.r api
ctx <- v8()
ctx$console()





