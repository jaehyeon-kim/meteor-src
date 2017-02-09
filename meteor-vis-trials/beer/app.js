import d3 from 'd3';
import crossfilter from 'crossfilter';
import dc from 'dc';

if(Meteor.isClient) {
    var fullDateFormat = d3.timeFormat('%a, %d %b %Y %X %Z');
    console.log(fullDateFormat(new Date));

    d3.json('untappd.json', function(error, data) {
        var beerData = data.response.beers.items;
        
        //"Fri, 10 Jul 2015 19:23:07 -0500"
        var fullDateParse = d3.timeParse('%a, %d %b %Y %X %Z');
        var yearFormat = d3.timeFormat('%Y');
        var monthFormat = d3.timeFormat('%b');
        var dayOfWeekFormat = d3.timeFormat('%a');

        // normalize/parse data so dc can correctly sort & bin them
        beerData.forEach(function(d) {
            d.count = +d.count;
            // round to nearest 0.25
            d.rating_score = Math.round(+d.rating_score * 4) / 4
            d.beer.rating_score = Math.round(+d.beer.rating_score *4) / 4;
            // round to nearest 0.5
            d.beer.beer_abv = Math.round(+d.beer.beer_abv * 2) / 2;
            // round to nearest 10
            d.beer.beer_ibu = Math.floor(+d.beer.beer_ibu / 10) * 10;
            d.first_had_dt = fullDateParse(d.first_had);
            d.first_had_year = +yearFormat(d.first_had_dt);
            d.first_had_month = monthFormat(d.first_had_dt);
            d.first_had_day = dayOfWeekFormat(d.first_had_dt);            
        });

        console.log(beerData);
    });   
}