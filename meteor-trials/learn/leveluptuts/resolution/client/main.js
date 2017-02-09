import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//export const Resolutions = new Mongo.Collection('resolutions');
Resolutions = new Mongo.Collection('resolutions');

Template.body.helpers({
    resolutions: function() {
        return Resolutions.find({});
    }
});

Template.resolution2.helpers({
    resolutions: [
        { title: "Hi there" }
    ]
})

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });

// if (Meteor.isClient) {
//   Session.setDefault('counter', 0);

//   Template.hello.helpers({
//     counter: function () {
//       return Session.get('counter');
//     }
//   });

//   Template.hello.events({
//     'click button': function(){
//       Session.set('counter', Session.get('counter') + 1);
//     }
//   });
// }