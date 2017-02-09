function render_g() {
    g = new Dygraph(
        document.getElementById("chart"),
        '/temperatures.csv',
        {
            legend: 'always',
            title: 'Temperatures',
            showRoller: true,
            rollPeriod: 1,
            //customBars: true,
            ylabel: 'Temperature (F)'
        }
    );

    return g; 
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
    Template.chartTemplate.onRendered(function() {
        render_g();
    });
}

