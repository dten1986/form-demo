'use strict';
var myApp = angular.module('myApp', []);

myApp.controller('form', ['$scope', function($scope) {
	$scope.fields = [
		{
			id: 1,
			type: 'text',
			required: 'required'
		},
		{
			id: 2,
			type: 'textarea',
			required: ''
		},
		{
			id: 3,
			type: 'select',
			options: [1, 2, 3, 4, 5],
			required: ''
		},
		{
			id: 4,
			type: 'checkbox',
			checked: false,
			required: ''
		}
	];
	
	$scope.addNewField = function() {
		if (!$scope.addNew)
			$scope.addNew = true;
		else
			$scope.addNew = false;
		
		
	};
	
	$scope.$watch('selType', function(newVal, oldVal) {
		if (newVal) {
			$scope.addNew = false;
			
			var newField = {
				'id': $scope.fields.length + 1,
				'type': newVal,
				'required': ''
			};
			
			if (newVal == 'select')
				newField.options = [1, 2, 3];
			
			if (newVal == 'checkbox')
				newField.checked = false;
			
			$scope.fields.push(newField);
		}
	});
	
	$scope.submit = function(form) {
		$scope.submitted = true;
console.log(form);
		if (form.$invalid)
			return;

		var config = {
			params : {
				'callback' : 'JSON_CALLBACK'
			},
		};
		
		for (var key in form)
			if (key.indexOf('$') < 0)
				config.params[key] = form[key].$viewValue;

		var xhr = new XMLHttpRequest();
		
		xhr.open('GET', 'response.json?submit=' + JSON.stringify(config));
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.responseText) {
				var resp = JSON.parse(xhr.responseText);
				if (resp.status == 'OK') {
					var data = '';
					for (var id in config.params)
						data += '\n' + id + ': ' + config.params[id] + ';';
					
					$scope.messages = resp.info + '\nSent data:\n' + data;
					$scope.$apply();
				}
			}
		}
		
		xhr.send(config);
	};
	
	
}]);