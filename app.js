$(function () { 

//Custom Bindings
	ko.bindingHandlers.editInPlace = {
	    init: function(element, valueAccessor) {
	        var observable = valueAccessor();
	       
	        $(element)
	        .click(function() {
						$(element).wrap('<input type="text" value='+observable+'>')
						.parent()
			    	.blur(function() {
							$(this).unwrap();
							console.log(asd);
						})
      			.keypress(function(e) {
      				code = (e.keyCode ? e.keyCode : e.which);
      				if (code == 13) alert('Enter key was pressed.');
        				e.preventDefault();
        			})
        			.text(observable);
	        	})
	    },
	    //update handler is given bound element + func to return assosciated data
	    update: function(element, valueAccessor) {
	        // On update, fade in/out
	        var shouldDisplay = valueAccessor();
	        shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
	    } 
	};

	//View Controller
	var View = function(title, templateName, data) {
		this.title = title;
		this.templateName = templateName;
		this.data = data; 
	};

	var PasswordsModel = function(){
	    var self = this;

	    self.passwords = ko.observableArray([
	        { location: "home", username: "one", password: "pwd", date: "1may" },
	        { location: "home1", username: "one1", password: "pw1d", date: "1may" },
	        { location: "home2", username: "one2", password: "pw2d",  date: "1may" }
	     ]);

	    self.addPassword = function() { 
	    	self.passwords.push({ location: "location", username: "username", password: "password", date: "date" })
	    };

	    self.removePassword = function(password) {
	    	self.passwords.remove(password); 
	    };
	};

	var KeyModel = function(){
	    this.keyName = ko.observable("Key one");
	    this.generatedDate= ko.observable("Dec 11 1988");
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