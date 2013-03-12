$(function () { 

  var pwdEncryptor = new encrpytor;

  //Behaviours
  var generateKeys = function (encVal, passVal, callback) {
    pwdEncryptor.generateKeys(encVal, passVal);
    callback(pwdEncryptor.getKeyStrings());
  };

  var saveEncrypted = function() {
    pwdEncryptor.importKeys(viewModel.publicKey, viewModel.privateKey);
    var passwordJSON = JSON.stringify(ko.toJS(self.passwords), null, 2);
    var encrypted = pwdEncryptor.encryptMsg(passwordJSON);
    self.encryptedData(encrypted);
  };

  var toggleModal = function(modalTarget) {
    $(modalTarget).modal('togle');
  };

  //Helper function
  var todo = function(msg){
    console.log(msg)
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
      self.passwords = ko.observableArray([]);
      self.decryptionPwd = ko.observable(null);
      self.currentAct= ko.observable(null);

      self.addPassword = function() { 
        self.passwords.push(new Password);
      };

      self.removePassword = function(password) {
        self.passwords.remove(password);
      };

      self.editEntry = function(edit){

      };

      self.encrypt = function() {
        pwdEncryptor.importKeys(viewModel.publicKey(), viewModel.privateKey());
        var passwordJSON = JSON.stringify(ko.toJS(self.passwords), null, 2);
        var encrypted = pwdEncryptor.encryptMsg(passwordJSON);
        viewModel.encryptedData(encrypted);
        self.lastSavedJson(JSON.stringify(ko.toJS(self.passwords), null, 2));
      };

      self.importPasswords = function(){
        //viewModel.encrypted
      };

      self.exportPasswords = function(){
        
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
        }
        catch (e) {
          viewModel.isAuthenticated(false);
          viewModel.flashText('Decryption Failed');
        }
        self.passwords(passwordArray);        
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
  var View = function(title, templateName, data) {
    this.title = title;
    this.templateName = templateName;
    this.data = data; 
  };
  
  var viewModel = {
      publicKey: ko.observable(null, {persist: 'publicKey'}),
      privateKey: ko.observable(null, {persist: 'privateKey'}),
      encryptedData: ko.observable(null, {persist: 'encryptedData'}),
      isSaved : ko.observable(true),
      isAuthenticated : ko.observable(null),
      flashText : ko.observable(null),
      views: ko.observableArray([
          new View("Pwds", "oneTmpl", new PasswordsModel),
          new View("Key", "twoTmpl", new KeyModel),
          // new View("In/Out", "twoTmpl", KeyModel)
          ]),
      selectedView: ko.observable(0),
  };

viewModel.selectedView(viewModel.views()[0]);

ko.applyBindings(viewModel);
});