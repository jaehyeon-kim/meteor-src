Todos = new Mongo.Collection('todos');
Lists = new Mongo.Collection('lists');

Router.configure({
    layoutTemplate: 'main'
});
Router.route('/', {
    name: 'home',
    template: 'home'
})
Router.route('/register');
Router.route('/login');
Router.route('/list/:_id', {
    name: 'listPage',
    template: 'listPage',
    data: function() {
        var currentList = this.params._id;
        return Lists.findOne({ _id: currentList });
    }
});

if(Meteor.isClient) {
    // individual todo items
    Template.todos.helpers({
        todo: function() {
            var currentList = this._id; // todos is under listPage
            return Todos.find({ listId: currentList }, { sort: { createdAt: -1 }});
        }
    });

    Template.todoItem.helpers({
        checked: function() {
            var isComplete = this.completed;
            return isComplete ? 'checked' : '';
        }
    });

    Template.countTodos.helpers({
        totalTodos: function() {
            var currentList = this._id;
            return Todos.find({ listId: currentList }).count();
        },
        completedTodos: function() {
            var currentList = this._id;
            return Todos.find({ listId: currentList, completed: true }).count();
        }
    });

    Template.addTodo.events({
        'submit form': function(event) {
            event.preventDefault();
            var todoName = $('.addTodo-input').val();
            var currentList = this._id; // todos is under listPage
            Todos.insert({
                name: todoName,
                completed: false,
                createdAt: new Date(),
                listId: currentList
            });
            $('.addTodo-input').val('');
        }
    });

    Template.todoItem.events({
        'click .todoItem-delete': function(event) {
            event.preventDefault();
            var documentId = this._id;
            var confirm = window.confirm('Delete this task?');
            if(confirm) {
                Todos.remove({ _id: documentId });
            }
        },
        'keyup .todoItem-input': function(event) {
            var documentId = this._id;
            var existingItem = Todos.findOne({ _id: documentId }).name;
            if(event.which === 13) {
                var todoItem = $(event.target).val();
                Todos.update({ _id: documentId }, { $set: { name: todoItem } });
            } else if(event.which === 27) {
                $(event.target).val(existingItem);
            }

            if(event.which === 13 || event.which === 27) {
                $(event.target).blur();
            }
        },
        'blur .todoItem-input': function(event) {
            var documentId = this._id;
            var existingItem = Todos.findOne({ _id: documentId }).name;
            var currentItem = $(event.target).val();
            if(existingItem !== currentItem) {
                $(event.target).val(existingItem);
            }
        },
        'change .todoItem-checkbox': function() {
            var documentId = this._id;
            var isComplete = event.target.checked;
            if(isComplete) {
                Todos.update({ _id: documentId }, { $set: { completed: true }});
            } else {
                Todos.update({ _id: documentId }, { $set: { completed: false }});
            }
        }
    });
    // lists of todo items
    Template.lists.helpers({
        list: function() {
            return Lists.find({}, {sort: {name: 1}});
        }
    });

    Template.addList.events({
        'submit form': function(event) {
            event.preventDefault();
            var listName = $('.addList-input').val();
            Lists.insert({
                name: listName
            }, function(error, results) {
                Router.go('listPage', { _id: results });
            });
            $('.addList-input').val('');
        }
    });

    Template.lists.events({
        'click .lists-delete': function(event) {
            event.preventDefault();
            var documentId = this._id;
            var confirm = window.confirm("Delete this list?")
            if(confirm) {
                // delete items first
                var numItems = Todos.find({ listId: documentId }).count();
                while(numItems > 0) {
                    var firstItem = Todos.findOne({ listId: documentId });
                    Todos.remove({ _id: firstItem._id });
                    numItems = Todos.find({ listId: documentId }).count();
                }
                Lists.remove({ _id: documentId });
            }
        }
    });

    // other group
    Template.main.helpers({
        currentYear: function() {
            var date = new Date();
            return date.getFullYear();
        }
    })
}

if(Meteor.isServer) {

}

// Event types that work alike across all major browsers
// click - Mouse click on any element, including links, buttons, or divs.
// dblclick - Double-clicks using the mouse.
// focus, blur - Text input or other form control fields that gain or lose focus. Any element with a tabindex property is considered focusable.
// change - Check boxes or radio buttons that change state.
// mouseenter, mouseleave - Entering or leaving an element with the mouse pointer.
// mousedown, mouseup - Pressing and releasing the mouse button.
// keydown, keypress, keyup - Pressing and releasing keys on a keyboard; keydown and keyup are mostly used for modifier keys such as Shift.

// Event compatibility tables - http://www.quirksmode.org/dom/events/index.html
// Event reference - https://developer.mozilla.org/en-US/docs/Web/Events?redirectlocale=en-US&redirectslug=DOM%2FDOM_event_reference
