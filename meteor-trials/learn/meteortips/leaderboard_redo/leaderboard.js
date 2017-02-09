PlayersList = new Mongo.Collection('players');

Meteor.methods({
    createPlayer: function(playerNameVar) {
        check(playerNameVar, String);
        var currentUserId = Meteor.userId();
        if(currentUserId) {
            PlayersList.insert({
                name: playerNameVar,
                score: 0,
                createdBy: currentUserId
            });
        }
    },
    removePlayer: function(selectedPlayer) {
        check(selectedPlayer, String);
        var currentUserId = Meteor.userId();
        if(currentUserId) {
            PlayersList.remove({ _id: selectedPlayer, createdBy: currentUserId });
        }
    },
    updateScore: function(selectedPlayer, score) {
        check(selectedPlayer, String);
        check(score, Number);
        var currentUserId = Meteor.userId();
        if(currentUserId) {
            PlayersList.update({ _id: selectedPlayer, createdBy: currentUserId },
                               { $inc: {score: score} });
        }
    }
})

if(Meteor.isClient) {
    Template.leaderboard.helpers({
        player: function() {
            var currentUserId = Meteor.userId();
            return PlayersList.find({ createdBy: currentUserId }, {sort: {score: -1, name: 1} });
        },
        selectedClass: function() {
            var playerId = this._id;
            var selectedPlayer = Session.get('selectedPlayer');
            if(playerId === selectedPlayer) {
                return 'selected';
            }
        },
        selectedPlayer: function() {
            var selectedPlayer = Session.get('selectedPlayer');
            return PlayersList.findOne({ _id: selectedPlayer });
        }
    });

    Template.leaderboard.events({
        'click .player': function() {
            var playerId = this._id;
            Session.set('selectedPlayer', playerId);
            // console.log(Session.get('selectedPlayer'));
        },
        'click .increment': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('updateScore', selectedPlayer, 5);
            // var currentUserId = Meteor.userId();
            // PlayersList.update({ _id: selectedPlayer}, { $inc: {score: 5} });
            // error: Uncaught Error: Not permitted | Untrusted code may only update documents by ID
            // PlayersList.update({ _id: selectedPlayer, createdBy: currentUserId }, { $inc: {score: 5} });
        },
        'click .decrement': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('updateScore', selectedPlayer, -5);
            // var currentUserId = Meteor.userId();
            // PlayersList.update({ _id: selectedPlayer }, { $inc: {score: -5} });
        },
        'click .remove': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('removePlayer', selectedPlayer);
            //PlayersList.remove( {_id: selectedPlayer });
        }
    });

    Template.addPlayerForm.events({
        'submit form': function(event) {
            event.preventDefault();
            var playerNameVar = event.target.playerName.value;
            Meteor.call('createPlayer', playerNameVar);
            // var currentUserId = Meteor.userId();
            // PlayersList.insert({ 
            //     name: playerNameVar,
            //     score: 0,
            //     createdBy: currentUserId });
            event.target.playerName.value = "";
        }
    });

    Meteor.subscribe('thePlayers');
}

if(Meteor.isServer) {
    Meteor.publish('thePlayers', function() {
        var currentUserId = this.userId;
        return PlayersList.find({ createdBy: currentUserId });
    })
}