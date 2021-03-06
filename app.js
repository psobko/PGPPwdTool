$(function () { 
/*============================================================
  Behaviours
  ============================================================*/

  var generateKeys = function (encVal, passVal, callback) {
    pwdEncryptor.generateKeys(encVal, passVal);
    callback(pwdEncryptor.getKeyStrings());
  };

  var toggleModal = function() {
    $('.modal').modal('hide');
  };

  var checkData = function() {
    if(!self.encryptedData) self.flashText = 'No encrypted data';
  };

  var checkAuthentication = function(){
    return viewModel.isAuthenticated;
  };

<<<<<<< HEAD
  var setFlash = function(message, handler){
    console.log(viewModel.flashText);
    var flashArray = [];
    console.log(flashArray);
    flashArray.push({'message':message, 'handler':handler});
    console.log(flashArray);
    viewModel.flashText(flashArray);
    //viewModel.flashText.push({'abc':'abc'});
    //viewModel.flashText().push({'message':message, 'handler':handler});
    //ko.applyBindings(viewModel, document.getElementById('flash'));
=======
  var setFlash = function(message, action, handler){
    viewModel.flashText.push({'message':message, 'action':action, 'handler':handler});
  };

  var removeFlash = function(flash){
    viewModel.flashText.remove(flash);
>>>>>>> UI fixes, refactoring.
  };

  var changeView = function(viewID){
    if(!viewModel.isAuthenticated()) viewID = 2;
    viewModel.selectedView(viewModel.views()[viewID]);
  };

  var saveConfig = function(param, value){
    var newConfig = viewModel.config();
    newConfig[param] = value;
    viewModel.config(newConfig);
  };
<<<<<<< HEAD

  var encrypt = function(){
    todo('asd');
  }
=======
>>>>>>> UI fixes, refactoring.

  //Helper function
  var todo = function(msg){
    console.log(msg);
  };

  /*============================================================
  Custom Bindings
  ============================================================*/
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
        })
        .change(function(e) {
          setFlash('Unsaved data!','Click here to save', self.encrypt);
        });
      }
  };

/*============================================================
  View Models
  ============================================================*/

  /******************
   *Decryption Model
   ******************/
  var DecryptModel = function(){
    var self = this;
    
    self.decryptionPwd = ko.observable(null);
    self.currentAct= ko.observable(null);
    self.importingData =  ko.observable(null);

    self.importData = function(){
      toggleModal();
      if(self.currentAct() === 'enter-data'){
        viewModel.encryptedData(self.importingData());
      }else{
        viewModel.encryptedData('');
        viewModel.isAuthenticated(true);
        changeView(0);
        viewModel.passwords([]);
<<<<<<< HEAD
        // self.addPassword();
=======
>>>>>>> UI fixes, refactoring.
      };
    };
    
    self.decrypt = function(){
      pwdEncryptor.importKeys(viewModel.publicKey(), viewModel.privateKey());
      if(!viewModel.encryptedData()){
        setFlash('No data to decrypt!');
        return;
      }
      var decrypted = pwdEncryptor.decryptMsg(viewModel.encryptedData(), self.decryptionPwd());
      var passwordArray = [];
      try {
        passwordArray = JSON.parse(decrypted);
        viewModel.isAuthenticated(true);
        viewModel.flashText([]);
        changeView(0)
      }
      catch (e) {
        viewModel.isAuthenticated(false);
        setFlash('Decryption failed!');
      }
      viewModel.passwords(passwordArray);
    };
  };
  
  /******************
   *Passwords Model
   ******************/
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

    self.addPassword = function() { 
      viewModel.passwords.push(new Password);
<<<<<<< HEAD
      setFlash('Unsaved data! <a href="#" data-bind="click: Click here to save.', self.encrypt);
=======
      setFlash('Unsaved data!','Click here to save', self.encrypt);
>>>>>>> UI fixes, refactoring.
      viewModel.isSaved = false;
    };

    self.removePassword = function(password) {
      viewModel.passwords.remove(password);
      setFlash('Unsaved data!','Click here to save', self.encrypt);
    };

    self.editEntry = function(edit){
      setFlash('Unsaved data!','Click here to save', self.encrypt);
    };

<<<<<<< HEAD
    self.encrypt = function() {
=======
    self.encrypt = function(flash) {
>>>>>>> UI fixes, refactoring.
      todo('encrypt');
      pwdEncryptor.importKeys(viewModel.publicKey(), viewModel.privateKey());
      var passwordJSON = JSON.stringify(ko.toJS(viewModel.passwords), null, 2);
      var encrypted = pwdEncryptor.encryptMsg(passwordJSON);
      viewModel.encryptedData(encrypted);
      self.lastSavedJson(JSON.stringify(ko.toJS(viewModel.passwords), null, 2));
<<<<<<< HEAD
      setFlash(null, null);
=======
      if(flash) removeFlash(flash);
>>>>>>> UI fixes, refactoring.
    };

  };

  /******************
   *Key Model
   ******************/
  var KeyModel = function(){
    var self = this;

    self.keyHint = ko.observable('key hint');
    self.keyDate = ko.observable(new Date().toLocaleString(), {persist: 'keyDate'});
    self.exportOptions = ko.observable('pub');

    self.genKeys = function(){
      generateKeys(512, 'asd', function(keystrings) {
        viewModel.publicKey(keystrings[0]);
        viewModel.privateKey(keystrings[1]);
      });
    };

    self.exportKeys = function(){
      var exportData = (self.exportOptions() === 'pub') ? viewModel.publicKey() : viewModel.publicKey() + '\n\n' + viewModel.privateKey() + '\n\n' ;
      
      //alternative saving - does not require external library but may not be supported by all browsers
      window.location='data:text/csv;charset=utf8,' + encodeURIComponent(viewModel.publicKey());
      saveConfig('dateSaved', new Date().toLocaleString());    

<<<<<<< HEAD
=======
      //saving using filesaver.js - allows for filenames
>>>>>>> UI fixes, refactoring.
      // try {
      //   saveAs(
      //     new Blob(
      //           [exportData + viewModel.encryptedData()],
      //           {type: "text/plain;charset=" + document.characterSet}
      //           ), 
      //     'pwdData.txt'
      //     );  

      //   viewModel.config().dateSaved(new Date().toLocaleString());
      // }
      // catch(e){
      //   viewModel.flashText('Export Failed');
      // }
    };
<<<<<<< HEAD
  };
  
  /******************
   *Settings Model
   ******************/
  var SettingsModel = function(){
    var self = this;

    self.config = viewModel.config();
    
    self.saveConfig = function(){
      viewModel.config(self.config);
    };
=======
>>>>>>> UI fixes, refactoring.
  };
  
  /******************
   *Settings Model
   ******************/
  var SettingsModel = function(){
    var self = this;

<<<<<<< HEAD
=======
    self.config = viewModel.config();
    
    self.saveConfig = function(){
      viewModel.config(self.config);
    };
  };

>>>>>>> UI fixes, refactoring.
/*============================================================
  View Controller
  ============================================================*/
  var View = function(title, templateName, data, visible) {
    this.title = title;
    this.templateName = templateName;
    this.data = data; 
    this.visible = visible;
  };
  
  var viewModel = {
      config: ko.observable({storePriv:false,
                              'storePub':false,
                              'storeData':false,
                              'dateGenerated':null,
                              'dateSaved':null,
                            }, {persist: 'configData'}),
      publicKey: ko.observable(null, {persist: 'publicKey'}),
      privateKey: ko.observable(null, {persist: 'privateKey'}),
      encryptedData: ko.observable(null, {persist: 'encryptedData'}),
      passwords: ko.observableArray([]),
      isSaved : ko.observable(true),
      isAuthenticated : ko.observable(false),
      flashText : ko.observableArray([]),
      views: ko.observableArray([]),
      selectedView: ko.observable(0),
  };

/*============================================================
  Init
  ============================================================*/

  viewModel['views'] = ko.observableArray([
            new View("Pwds", "pwdsTmpl", new PasswordsModel, true),
            new View("Export", "exportTmpl", new KeyModel, true),
            new View("Decrypt", "decryptTmpl", new DecryptModel, false),
            new View("Settings", "settingsTmpl", new SettingsModel, true),
            ]);
  
  var pwdEncryptor = new encrpytor;
<<<<<<< HEAD

  checkData();
  changeView(0)

=======

  checkData();
  changeView(0)

>>>>>>> UI fixes, refactoring.
  ko.applyBindings(viewModel);
  
});

/*============================================================
  Move / Todo
  ============================================================*/

//OpenPGP Message Helper - Needs to be in calling context
var showMessages = function(text){
  console.log($(text).text());
};

$(window).bind("beforeunload", function(event) {
    //if(viewModel.isSaved) 
      // return "You have unsaved changes";
});

//Issues with the flash text - had to create an array in order to
// maintain bindings but now there flash container is permanently 
// displayed.
