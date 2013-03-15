$(function () { 

  var pwdEncryptor = new encrpytor;

  //Behaviours
  var generateKeys = function (encVal, passVal, callback) {
    pwdEncryptor.generateKeys(encVal, passVal);
    callback(pwdEncryptor.getKeyStrings());
  };

  var toggleModal = function() {
    $('.modal').modal('hide');
  };

  var checkData = function() {
    if(!self.encryptedData) self.flashText = 'No encrypted data';
  }

  var checkAuthentication = function(){
    return viewModel.isAuthenticated;
  }

  var setFlash = function(message){
    viewModel.flashText(message);
    console.log(message);
  }

  var changeView = function(viewID){
    if(!viewModel.isAuthenticated()) viewID = 2;
    viewModel.selectedView(viewModel.views()[viewID]);
  }

  //Helper function
  var todo = function(msg){
    console.log(msg);
  };

  //Custom Bindings
  ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        var shouldDisplay = valueAccessor();
        $(element).hide();
    },
    update: function(element, valueAccessor) {
        var shouldDisplay = valueAccessor();
        shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
    } 
  };

  ko.bindingHandlers.editInPlace = {
      init: function(element, valueAccessor) {
        var type = $(element).attr('type');
        $(element)
        .click(
          function() {
            $(this).removeClass('inactive').attr('type', 'text').select();
        })
        .blur(function() {
          $(this).toggleClass('inactive').attr('type', type);
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
      } 
  };

  //View Models
  var DecryptModel = function(){
    var self = this;
    
    self.decryptionPwd = ko.observable(null);
    self.currentAct= ko.observable(null);
    self.importingData =  ko.observable(null);

    self.importData = function(){
      //$('.modal').modal('hide');
      toggleModal();
      if(self.currentAct() === 'enter-data'){
        viewModel.encryptedData(self.importingData());
      }else{
        viewModel.encryptedData('');
        viewModel.isAuthenticated(true);
        changeView(0);
        viewModel.passwords([]);
        // self.addPassword();
      }
      
    };
    
    self.decrypt = function(){
      pwdEncryptor.importKeys(viewModel.publicKey(), viewModel.privateKey());
      if(!viewModel.encryptedData()){
        viewModel.flashText('No data to decrypt!');
        return;
      }
      var decrypted = pwdEncryptor.decryptMsg(viewModel.encryptedData(), self.decryptionPwd());
      var passwordArray = [];
      try {
        passwordArray = JSON.parse(decrypted);
        viewModel.isAuthenticated(true);
        viewModel.flashText(null);
        changeView(0)
      }
      catch (e) {
        viewModel.isAuthenticated(false);
        viewModel.flashText('Decryption Failed');
      }
      viewModel.passwords(passwordArray);
    };
  }

  var Password = function() {
    var self = this;
    self.location = ko.observable('');
    self.username = ko.observable('');
    self.password = ko.observable('');
    self.date = ko.observable(new Date().toLocaleString());
  };

  var PasswordsModel = function(){
    var self = this;
  
    self.lastSavedJson = ko.observable(null, {persist: 'lastSavedJson'});
    //self.passwords = ko.observableArray([]);

    self.addPassword = function() { 
      viewModel.passwords.push(new Password);
      setFlash('Unsaved data!');
      viewModel.isSaved = false;
    };

    self.removePassword = function(password) {
      viewModel.passwords.remove(password);
      setFlash('Unsaved data!');
    };

    self.editEntry = function(edit){
      setFlash('Unsaved data!');
    };

    self.encrypt = function() {
      pwdEncryptor.importKeys(viewModel.publicKey(), viewModel.privateKey());
      var passwordJSON = JSON.stringify(ko.toJS(viewModel.passwords), null, 2);
      var encrypted = pwdEncryptor.encryptMsg(passwordJSON);
      viewModel.encryptedData(encrypted);
      self.lastSavedJson(JSON.stringify(ko.toJS(viewModel.passwords), null, 2));
      setFlash(null);
    };

  };

  var KeyModel = function(){
      var self = this;

      self.keyHint = ko.observable("key hint");
      self.keyDate = ko.observable(new Date().toLocaleString(), {persist: 'keyDate'});

      this.genKeys = function(){
        generateKeys(512, 'asd', function(keystrings) {
          viewModel.publicKey(keystrings[0]);
          viewModel.privateKey(keystrings[1]);
        });
      };
  };

  //Views Controller
  var View = function(title, templateName, data, visible) {
    this.title = title;
    this.templateName = templateName;
    this.data = data; 
    this.visible = visible;
  };
  
  var viewModel = {
      publicKey: ko.observable(null, {persist: 'publicKey'}),
      privateKey: ko.observable(null, {persist: 'privateKey'}),
      encryptedData: ko.observable(null, {persist: 'encryptedData'}),
      passwords: ko.observableArray([]),
      isSaved : ko.observable(true),
      isAuthenticated : ko.observable(null),
      flashText : ko.observable(null),
      views: ko.observableArray([
          new View("Pwds", "oneTmpl", new PasswordsModel, true),
          new View("Export", "twoTmpl", new KeyModel, true),
          new View("Decrypt", "threeTmpl", new DecryptModel, false),
          ]),
      selectedView: ko.observable(0),

  };

changeView(0);
checkData();
ko.applyBindings(viewModel);

});

//OpenPGP Message Helper - Needs to be in calling context
var showMessages = function(text){
  console.log($(text).text());
};

$(window).bind("beforeunload",function(event) {
    //if(viewModel.isSaved) 
      // return "You have unsaved changes";
});