import d3 from 'd3';
import crossfilter from 'crossfilter';
import dc from 'dc';

if(Meteor.isClient) {
    //console.log(d3);

    Template.barTemplate.onRendered(function() {
        var chart = dc.barChart('#bar');

        d3.csv('morley.csv', function(error, data) {
            if(error)
                console.log('Error to read data');

            data.forEach(function(x) {
                x.Speed = +x.Speed;
            });

            var ndx = crossfilter(data);
            var runDimension = ndx.dimension(function(d) {
                    return +d.Run;
                });
            var speedSumGroup = runDimension.group().reduceSum(function(d) {
                return d.Speed * d.Run / 1000;
            });

            //dc.scale.linear() to dc.scaleLinear()
            chart
                .width(768)
                .height(480)
                .x(d3.scaleLinear().domain([6, 20]))
                .yAxisLabel('This is the Y Axis!')
                .dimension(runDimension)
                .group(speedSumGroup);

            chart.render();
        });
    });

}