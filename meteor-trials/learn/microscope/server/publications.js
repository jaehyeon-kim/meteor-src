Meteor.publish('posts', function() {
    return Posts.find();
});


// // securely transfer data
// Meteor.publish('posts', function(author) {
//     return Posts.find({flagged: false, author: author});
// });

// Meteor.subscribe('posts', 'user-name');

// // further subsetting for scalability
// Template.posts.helpers({
//     posts: function() {
//         return Posts.find({ author: 'user-name', category: 'Javascript'});
//     }
// });

// // further slicing
// Meteor.publish('posts', function() {
//     return Posts.find({}, {field: {date: false}});
// });