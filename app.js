$(function () { 
  //Helper function
  var todo = function(msg){
    console.log(msg)
  };
  
  //Custom Bindings
  ko.bindingHandlers.editInPlace = {
      init: function(element, valueAccessor) {

        $(element)
        .click(
          function() {
            todo('add border');
            $(this).select();
        })
        .hover(
          function() {
            todo('add underline')
          },
          function() {
            todo('remove underline')
          }
        )
        .blur(function() {
          todo('remove border')
        })
        .keypress(function(e) {
              code = (e.keyCode ? e.keyCode : e.which);
              if (code === 13){
                alert('Enter key was pressed.');
                e.preventDefault();
              }
          });
        },
   
      update: function(element, valueAccessor) {
        todo('add flash - save');
      } 
  };

  ko.bindingHandlers.fadeVisible = {
      init: function(element, valueAccessor) {
          var shouldDisplay = valueAccessor();
          //$(element).toggle(shouldDisplay);
      },
      update: function(element, valueAccessor) {
          var shouldDisplay = valueAccessor();
          shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
      } 
  };

  //View Models
  var Password = function() {
      var self = this;
      self.location = ko.observable('');
      self.username = ko.observable('');
      self.password = ko.observable('');
      self.date = ko.observable('');
  };

  var PasswordsModel = function(){
      var self = this;
    
      self.passwords = ko.observableArray([new Password()]);
      self.lastSavedJson = ko.observable("");

      self.addPassword = function() { 
        self.passwords.push(new Password);
      };

      self.removePassword = function(password) {
        self.passwords.remove(password);
      };

      self.editEntry = function(edit){

      };

      self.save = function() {
        self.lastSavedJson(JSON.stringify(ko.toJS(self.passwords), null, 2));
      };
  };

  var KeyModel = function(){
      this.keyName = ko.observable("Key one");
      this.generatedDate= ko.observable("Dec 11 1988");
  };

  //Views Controller
  var View = function(title, templateName, data) {
    this.title = title;
    this.templateName = templateName;
    this.data = data; 
  };
  
  var viewModel = {
      views: ko.observableArray([
          new View("Pwds", "oneTmpl", new PasswordsModel),
          new View("Key", "twoTmpl", new KeyModel),
          // new View("In/Out", "twoTmpl", KeyModel)
          ]),
      selectedView: ko.observable()    
  };

ko.applyBindings(viewModel);
});