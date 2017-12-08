'use strict';
var myApp = angular.module('myApp', []);

myApp.controller('list', ['$scope', '$http', function($scope, $http) {
	function syncList(data, callback) {
		var params = {
			method: 'GET',
			url: 'form-handler.php' + (data ? '?submit=' + JSON.stringify(data) : ''),
		};

		$http(params).then(function successCallback(resp) {
			callback(resp);
		}, function errorCallback(resp) {
			console.log('Form handler error!');
		});
	}
	
	var defaultFormVal = {
		title: 'Add new item',
		text: '',
		textarea: '',
		select: 'Option 1',
		checkbox: false,
		index: -1
	};

	$scope.list = [];
	$scope.formVisible = false;
	
	$scope.submit = function(form) {
		$scope.submitted = true;

		if (form.$invalid)
			return;

		var newItem = {
			checkbox: $scope.formVal.checkbox,
			text: $scope.formVal.text,
			textarea: $scope.formVal.textarea,
			select: $scope.formVal.select
		};
		
		if ($scope.formVal.index == -1)
			$scope.list.push(newItem);
		else
			$scope.list[$scope.formVal.index] = newItem;
		
		var data = {
			index: $scope.formVal.index,
			item: newItem
		};

		syncList(data, function(resp) {
			$scope.messages = resp.info;
			$scope.submitted = false;
			$scope.formVisible = false;
		//	$scope.$apply();
		});
	};
	
	$scope.openForm = function() {
		$scope.formVal = defaultFormVal;
		$scope.formVisible = true;
	}
	
	$scope.closeForm = function() {
		$scope.formVisible = false;
	}
	
	$scope.editItem = function(index) {
		$scope.formVal = {
			title: 'Edit item ' + (index + 1),
			text: $scope.list[index].text,
			textarea: $scope.list[index].textarea,
			select: $scope.list[index].select,
			checkbox: $scope.list[index].checkbox,
			index: index
		};
		$scope.formVisible = true;
	}

	$scope.removeItem = function(item) {
		var index = $scope.list.indexOf(item);
		$scope.list.splice(index, 1);
		syncList({index: index}, function() {});
	}
	
	// action
	syncList(null, function(resp) {
		$scope.list = resp.data;
	});
}]);