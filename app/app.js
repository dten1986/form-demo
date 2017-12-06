'use strict';
var myApp = angular.module('myApp', []);

myApp.controller('form', ['$scope', function($scope) {
	$scope.submit = function(form) {
		$scope.submitted = true;

		if (form.$invalid)
			return;

		 var config = {
			params : {
				'callback' : 'JSON_CALLBACK',
				'text' : form.text.$viewValue,
				'textarea' : form.textarea.$viewValue,
				'select' : form.select.$viewValue,
				'checkbox' : form.checkbox.$viewValue
			},
		};

		var xhr = new XMLHttpRequest();
		
		xhr.open('GET', 'response.json/submit?' + JSON.stringify(config));
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.responseText) {
				var resp = JSON.parse(xhr.responseText);
				if (resp.status == 'OK') {
					$scope.messages = resp.info + '\nSent data:\ntext: ' + config.params.text + ';\ntextarea: ' + config.params.textarea + ';\nselect: ' + config.params.select + ';\ncheckbox: ' + config.params.checkbox;
					$scope.$apply();
				}
			}
		}
		
		xhr.send(config);
	};
	
	
}]);