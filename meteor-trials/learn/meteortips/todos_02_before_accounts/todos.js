Todos = new Mongo.Collection('todos');
Lists = new Mongo.Collection('lists');

Router.configure({
    layoutTemplate: 'main'
});
Router.route('/', {
    name: 'home',
    template: 'home'
});
Router.route('/register');
Router.route('/login');
Router.route('/list/:_id', {
    name: 'listPage',
    template: 'listPage',
    data: function() {
        var currentList = this.params._id;
        return Lists.findOne({ _id: currentList });
    }
})

if(Meteor.isClient) {
    Template.todos.helpers({
        todo: function() {
            var currentList = this._id; // todos is under listPage
            return Todos.find({ listId: currentList }, {sort: {createdAt: -1 } });
        }
    });

    Template.todoItem.helpers({
        checked: function() {
            var isCompleted = this.completed;
            return isCompleted ? 'checked' : '';
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

    Template.main.helpers({
        currentYear: function() {
            var date = new Date();
            return date.getFullYear();
        }
    });

    Template.lists.helpers({
        list: function() {
            return Lists.find({}, {sort: {name: 1}});
        }
    });

    Template.addTodo.events({
        'submit form': function(event) {
            event.preventDefault();
            var todoName = $('.addTodo-input').val();
            var currentList = this._id;
            Todos.insert({
                name: todoName,
                completed: false,
                createdAt: new Date(),
                listId: currentList
            });
            $('.addTodo-input').val('');
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
    })

    Template.todoItem.events({
        'click .todoItem-delete': function(event) {
            event.preventDefault();
            var documentId = this._id;
            var confirm = window.confirm("Delete this task?");
            if(confirm) {
                Todos.remove({ _id: documentId });
            }
        },
        'keyup .todoItem-input': function(event) {
            var documentId = this._id;
            var existingItem = Todos.findOne({ _id: documentId }).name;
            // 13: return, 27: escape
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
            var isCompleted = event.target.checked;
            if(isCompleted) {
                Todos.update({ _id: documentId }, { $set: { completed: true } });
            } else {
                Todos.update({ _id: documentId }, { $set: { completed: false } });
            }
        }
    });

    Template.lists.events({
        'click .lists-delete': function(event) {
            event.preventDefault();
            var documentId = this._id;
            var confirm = window.confirm("All items in this list will be deleted");
            if(confirm) {
                // delete all items
                var numItems = Todos.find( { listId: documentId }).count();
                while(numItems > 0) {
                    var items = Todos.findOne( {listId: documentId });
                    Todos.remove({ _id: items._id });
                    numItems -= 1;
                }
                Lists.remove( { _id: documentId });
            }
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
