'use strict';
var myApp = angular.module('myApp', []);

myApp.controller('form', ['$scope', function($scope) {
	function _xhr(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.responseText)
				callback(JSON.parse(xhr.responseText));
		}
				
		xhr.send();
	}
	
	// Saved form data
	_xhr('form-handler.php', function(resp) {
		$scope.form_data = resp;
		$scope.$apply();
	})
	
	$scope.form_data = '';
	$scope.fields = [
		{
			id: 1,
			type: 'text',
			required: true
		},
		{
			id: 2,
			type: 'textarea',
		},
		{
			id: 3,
			type: 'select',
			options: [1, 2, 3, 4, 5],
		},
		{
			id: 4,
			type: 'checkbox',
			checked: false,
		}
	];
	
	$scope.addNewField = function() {
		if (!$scope.addNew)
			$scope.addNew = true;
		else
			$scope.addNew = false;
		
		
	};
	
	$scope.removeField = function(id) {
		for (var i = 0; i < $scope.fields.length; i++) {
			if ($scope.fields[i].id == id) {
				$scope.fields.splice(i, 1);
				break;
			}
		}
	}
	
	$scope.$watch('selType', function(newVal, oldVal) {
		if (newVal) {
			$scope.addNew = false;
			
			var newField = {
				'id': $scope.fields.length + 1,
				'type': newVal,
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

		if (form.$invalid)
			return;

		var config = {};
		
		for (var key in form)
			if (key.indexOf('$') < 0)
				config[key] = '' + form[key].$viewValue;

		_xhr('form-handler.php?submit=' + JSON.stringify(config), function(resp) {
			if (resp.status == 'OK') {
				$scope.messages = resp.info;
				$scope.form_data = resp.data;
				$scope.submitted = false;
				$scope.$apply();
			}
		});
	};
	
	
}]);