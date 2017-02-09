//https://forums.meteor.com/t/meteor-python/2563
//https://forums.meteor.com/t/streaming-stdout-on-exec-and-bindenvironment/1710/6

DataSets = new Mongo.Collection('datasets');

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
        console.log(DataSets.find().fetch());
    }
}


if(Meteor.isClient) {
    Template.body.events({
        'click #run': function(event) {
            var cmd = 'Rscript C:\\workspace\\meteor-trials\\app-trials\\child-process\\.script\\example.R';
            Meteor.call('consoleExecSync', cmd);
            console.log('Meteor.consoleExecSync called');
        }
    });
}


// it works
// if(Meteor.isServer) {
//     spawn = Npm.require('child_process').spawn;

//     //var basePath = path.resolve('../../../../../.');
//     //var basePath = process.env.PWD;
//     var basePath = 'C:\\workspace\\meteor-trials\\app-trials\\child-process';
//     var scriptPath = basePath + '\\.script\\example.R'

//     command = spawn('Rscript', [scriptPath]);
//     command.stdout.on('data', function(data) {
//         console.log('stdout: ' + data);
//     });
//     command.stderr.on('data', function(data) {
//         console.log('stderr: ' + data);
//     });
//     command.on('exit', function(code) {
//         console.log('child process exited with code ' + code);
//     });
// }