Test = {};
Test.userLists = new Meteor.Collection("userLists");

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to autocomplete-issue35.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    },
    'submit #helloForm': function (e, tmpl) {
      e.preventDefault();
      var modifier = {$set: {list: $('#myInput').val()}};
      // update
      Test.userLists.update({_id: "1"}, modifier, function (err) {if (err) console.log(err);});
    }
  });

  Template.myInput.userList = function () {
    var list = Test.userLists.findOne("1");
      return list.list;
  }

  Template.myInput.settings = function() {
    return {
      position: "top",
      limit: 4,
      rules: [
        {
          token: '@',
          collection: Meteor.users,
          field: "username",
          template: Template.userPill,
          matchAll: true,
        }
      ]
    }
  };

  Meteor.startup(function () {
    Meteor.setTimeout(function () {
      // Durty way to wait subscription :)
      UI.insert(UI.render(Template.myInput), document.getElementById("myInputGroup"))
    }, 2000);
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Meteor.users.find().count() === 0) {
      var names = [{_id: "1", username: "Ada"},
                   {_id: "2", username: "Bea"},
                   {_id: "3", username: "Cloa"},
                   {_id: "4", username: "Ziba"},
                   {_id: "5", username: "Noe"},
                   {_id: "6", username: "Rahan"}];
      for (var i = 0; i < names.length; i++)
        Meteor.users.insert({_id: names[i]._id, username: names[i].username});
    }
    if (Test.userLists.find().count() === 0) {
      var lists = [{_id: "1", list: "@Ada"}];
      for (var i = 0; i < lists.length; i++)
        Test.userLists.insert({_id: lists[i]._id, list: lists[i].list});
    }
  });
}
