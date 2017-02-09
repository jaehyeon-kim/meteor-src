Products = new Mongo.Collection('products');

if (Meteor.isClient) {
    Template.fridge.onRendered(function() {
        var templateInstance = this;

        templateInstance.$('#fridge').droppable({
            drop: function (evt, ui) {
                var query = {
                    _id: ui.draggable.data('id')
                };
                var changes = {
                    $set: {
                        place: 'fridge'
                    }
                };
                Products.update(query, changes)
            }
        });
    });

    Template.productList.onRendered(function() {
        var templateInstance = this;

        templateInstance.$('#supermarket').droppable({
            drop: function (evt, ui) {
                var query = {
                    _id: ui.draggable.data('id')
                };
                var changes = {
                    $set: {
                        place: 'supermarket'
                    }
                };
                Products.update(query, changes)
            }
        });
    });

    Template.productListItem.onRendered(function() {
        var templateInstance = this;

        templateInstance.$('.draggable').draggable({
            curse: 'move',
            helper: 'clone'
        });
    });

    Template.fridge.helpers({
        products() {
            return Products.find({ place: 'fridge' });
        }
    })

    Template.productList.helpers({
        products() {
            return Products.find({ place: 'supermarket' });
        }
    })
}

if (Meteor.isServer) {
    Products.remove({});

    Products.insert({
        name: 'Milk',
        img: '/milk.png',
        place: 'fridge'
    });

    Products.insert({
        name: 'Juice',
        img: '/juice.png',
        place: 'fridge'
    });

    Products.insert({
        name: 'Bread',
        img: '/bread.png',
        place: 'supermarket'
    });

    Products.insert({
        name: 'Banana',
        img: '/banana.png',
        place: 'supermarket'
    });
}

// import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';

// import './main.html';

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
