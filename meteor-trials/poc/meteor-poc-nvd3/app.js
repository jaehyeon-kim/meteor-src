function getData() {
    return [
      {
        //key: "Cumulative Return",
        values: [
          { 
            "label" : "January" ,
            "value" : 60
          } , 
          { 
            "label" : "February" , 
            "value" : 59
          } , 
          { 
            "label" : "March" , 
            "value" : 90
          } , 
          { 
            "label" : "April" , 
            "value" : 81
          } , 
          { 
            "label" : "May" ,
            "value" : 56
          } , 
          { 
            "label" : "Jun" , 
            "value" : 55
          } , 
          { 
            "label" : "July" , 
            "value" : 40
          }
        ]
      }
    ];
}

if(Meteor.isClient) {
    Session.setDefault('slider', 30);

    // slider template
    Template.sliderTemplate.rendered = function () {
        this.$("#slider").noUiSlider({
            start: Session.get('slider'),
            connect: 'lower',
            range: {
                'min': 1,
                'max': 50
            }
        }).on('slide', function (event, value) {
            // set values on 'slide' event
            Session.set('slider', Math.ceil(value));
        }).on('change', function (event, value) {
            // round off on 'change' event
            Session.set('slider', Math.ceil(value));
        });
    };

    Template.sliderTemplate.helpers({
        slider: function() {
            return Session.get('slider');
        }
    });

    // chart template
    Template.chartTemplate.rendered = function() {
        this.autorun(function() {
            nv.addGraph(function() {
                var chart = nv.models.discreteBarChart()
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
                    .staggerLabels(true)
                    .tooltips(true)
                    .showValues(false)

                //chart.xAxis.axisLabel('X label');
                chart.yAxis.axisLabel('Y label').tickFormat(d3.format('d'));

                d3.select('#chart svg')
                    .datum(getData())
                    .transition().duration(500)
                    .call(chart)
                ;

              nv.utils.windowResize(chart.update);

              return chart;
            });
        });
    }

}