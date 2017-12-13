var defaultFormVal = {
	title: 'Add new item',
	text: '',
	textarea: '',
	select: 'Option 1',
	checkbox: false,
	index: -1
};
var handler = 'form-handler.php';

function _xhr(data, callback) {
	var url = data ? handler + '?submit=' + JSON.stringify(data) : handler,
		xhr = new XMLHttpRequest();

	xhr.open('GET', url);
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.responseText)
			callback(JSON.parse(xhr.responseText));
	}
				
	xhr.send();
}

var app = new Vue({
	el: '#addItem',
	data: {
		formVisible: false,
		formVal: defaultFormVal,
		formSubmit: false,
		submited: false,
		list: [],
		messages: ''
	},
	mounted: function() {
		var _this = this;
		_xhr(null, function(resp) {
			_this.list = resp;
		});
	},
	methods: {
		onSubmit: function(e) {		
			this.formSubmit = true;
			var newItem = {
				checkbox: this.formVal.checkbox,
				text: this.formVal.text,
				textarea: this.formVal.textarea,
				select: this.formVal.select
			};
			
			if (this.formVal.index == -1)
				this.list.push(newItem);
			else 
				for (var key in newItem) 
					this.list[this.formVal.index][key] = newItem[key];
			
			var data = {
				index: this.formVal.index,
				item: newItem
			};
			
			var _this = this;
			_xhr(data, function(resp) {
				//console.log('data sent', resp);
				_this.formSubmit = false;
				_this.messages = resp.info;
				_this.formVisible = false;
				
				setTimeout(function() {
					_this.messages = '';
				}, 3000);
			});
			
			e.preventDefault();
		},
		hideForm: function() {
			this.formVisible = !this.formVisible;
		},
		showForm: function() {
			this.formVal = defaultFormVal;
			this.formVisible = true;
		},
		editItem: function(index) {
			this.formVal.index = index;
			this.formVal.title = 'Edit item ' + (index + 1);
			
			for (var key in this.list[index])
				this.formVal[key] = this.list[index][key]
			
			this.showForm();
		},
		removeItem: function(item) {
			var index = this.list.indexOf(item);
			this.list.splice(index, 1);
			_xhr({index: index}, function() {});
		}
	}
});