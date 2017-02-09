DataSets = new Mongo.Collection('datasets');

function renderChart(data) {
    nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .staggerLabels(true)
            .tooltips(true)
            .showValues(false)

        //chart.xAxis.axisLabel('X label');
        chart.yAxis.axisLabel('Frequency').tickFormat(d3.format('d'));

        d3.select('#chart svg')
            .datum(data)
            .transition().duration(500)
            .call(chart)
        ;

      nv.utils.windowResize(chart.update);

      return chart;
    });
}

// function getData() {
// return [{"values":[{"label":"40","value":26},{"label":"50","value":57},{"label":"60","value":24},{"label":"70","value":81},{"label":"80","value":78},{"label":"90","value":6}]}];
// }

if(Meteor.isClient) {
    DataSets.find().observe({
        added: function(document) {
            console.log('groups observe added value function');
            console.log(document.data);
            renderChart(JSON.parse(document.data));
        },
        changed: function(new_document, old_document) {
            console.log('groups observe changed value function');
        },
        removed: function(document) {
            console.log('groups observe removed value function');
        }
    });
  
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
            console.log('slider: ' + Session.get('slider'));
            //var cmd = 'Rscript C:\\workspace\\meteor-trials\\app-trials\\meteor-poc-nvd3-cp\\.script\\example.R' + ' ' + Session.get('slider');
            var cmd = 'Rscript /home/jaehyeon/meteor-trials/app-trials/meteor-poc-nvd3-cp/.script/example.R' + ' ' + Session.get('slider');
            Meteor.call('consoleExecSync', cmd);
            //console.log(DataSets.findOne().data);
            //renderChart(getData());
        });
    };

    Template.sliderTemplate.helpers({
        slider: function() {
            return Session.get('slider');
        }
    });
}

if (Meteor.isServer) {
    exec = Npm.require('child_process').exec;
    Fiber = Npm.require('fibers');

    _execSync = function(cmd, stdoutHandler, stderrHandler) {
        exec(cmd, Meteor.bindEnvironment(
                function(error, stdout, stderr) {
                    if (stdout != "")
                        stdoutHandler(stdout);
                    if (stderr != "")
                        stderrHandler(stderr);
                }
            )
        );
    }

    Meteor.methods({
        consoleExecSync : function(cmd) {
            _execSync(cmd, consoleInsert, consoleInsert);
        }
    });

    consoleInsert = function(_data) {
        DataSets.remove({});
        DataSets.insert({
            timestamp: new Date().getTime(),
            data: _data
        });
    }
}

