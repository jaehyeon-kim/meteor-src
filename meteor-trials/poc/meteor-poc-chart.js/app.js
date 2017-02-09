function drawLine(){
    Chart.defaults.global.responsive = true;
    Chart.defaults.global.maintainAspectRatio = false;
    var data = {
    labels : ["January","February","March","April","May","June","July"],
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [65,59,90,81,56,55,40]
        },
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : [28,48,40,19,96,27,100]
        }
        ]
    }

    //Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#myChart").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx);

    new Chart(ctx).Line(data);
}

function drawBar(){
    Chart.defaults.global.responsive = true;
    Chart.defaults.global.maintainAspectRatio = false;
    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: [65, 59, 80, 81, 56, 55, 40],
            }
        ]
    };

    //Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#myChart").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx);

    new Chart(ctx).Bar(data);
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
        drawBar();
    }

}