if(Meteor.isClient) {
    Session.setDefault('selectMethod');

    Template.methods.helpers({
        methodName: function() {
            return [
                '',
                'blockingMethod',
                'nonBlockingMethod',
                'wrapAsyncMethod',
                'sequential',
                'unblock',
                'unboundEnvironment',
                'bindEnvironment'
            ];
        }
    });

    Template.methods.events({
        'change #methodName': function(evt) {
            Session.set('selectedMethod', evt.currentTarget.value);
        },
        'click #callMethod': function(evt, tpl) {
            var methodName = Session.get('selectedMethod');
            var parameter = parseInt(tpl.$('#parameter').val());

            console.log(moment().format('HH:mm:ss') + ' calling ' + methodName + ' with parameter ' + parameter);
            Meteor.call(methodName, parameter, function (error, result) {
                console.log(moment().format('HH:mm:ss') + ' result ' + result);
            })
        }
    });
}

// blocking method
addSync = function(a, b) {
    return a + b;
}
blockFor3s = function(value) {
    var waitUntil = new Date().getTime() + 3000;
    while(new Date().getTime() < waitUntil) {};
    return value;
}

Meteor.methods({
    'blockingMethod': function(value) {
        console.log('Method.blockingMethod called');
        var returnValue = 0;
        resultComputation = blockFor3s(value);
        returnValue = addSync(resultComputation, 1);
        return returnValue;
    }
});

// non-blocking method
setTimeoutFor3s = function(value) {
    var result = value;
    setTimeout(function() {
        result += 3;
        console.log('Result after timeout', result);
    }, 3000);
    return result;
}

Meteor.methods({
    'nonBlockingMethod': function() {
        console.log('Method.nonBlockingMethod');
        var returnValue = 0;
        returnValue = setTimeoutFor3s(returnValue);
        console.log('resultComputation', returnValue);
        return returnValue;
    }
});

//wrapAsync method
setTimeoutFor3sCb = function(value, cb) {
    var result = value;
    // NOT Meteor.setTimeout
    setTimeout(function() {
        console.log('Result after timeout', result);
        cb(null, result + 3);
    }, 3000);
}

Meteor.methods({
    'wrapAsyncMethod': function() {
        console.log('Method.wrapAsyncMethod');
        var returnValue = 0;
        returnValue = Meteor.wrapAsync(setTimeoutFor3sCb)(returnValue);
        console.log('resultComputation', returnValue);
        return returnValue;
    }
});

// unblock
block = function(value, cb) {
    setTimeout(function() {
        cb(null, true);
    }, 3000);
}

Meteor.methods({
    'sequential': function(value) {
        console.log('Method.sequential', value);
        Meteor.wrapAsync(block)(value);
        console.log('Method.sequential returns', value);
        return true;
    },
    'unblock': function(value) {
        console.log('Method.unblock', value);
        this.unblock();
        Meteor.wrapAsync(block)(value);
        console.log('Method.unblock returns', value);
        return true;
    }
});

// unboundEnvironment
Meteor.methods({
    'unboundEnvironment': function() {
        console.log('Method.unboundEnvironment: ' + Meteor.userId());

        setTimeoutFor3sCb(2, function() {
            console.log('3s later: ', Meteor.userId());
        });
    },
    'bindEnvironment': function() {
        console.log('Method.bindEnvironment: ', Meteor.userId());

        setTimeoutFor3sCb(2, Meteor.bindEnvironment(function() {
            console.log('Method.bindEnvironment (3s delay): ', Meteor.userId());
        }));
    }
})







