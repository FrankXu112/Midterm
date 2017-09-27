/* global jQuery */

var App = function () {};

App.prototype.getUsers = function () {
	return JSON.parse(localStorage.getItem('users'));
};

App.prototype.userExists = function (username) {
	var exists = false;
	var users = this.getUsers();

	for (var i in users) {
		if (users[i].name === username) {
			exists = true;
			break;
		}
	}

	return exists;
};

App.prototype.initialize = function () {
	if (localStorage.getItem('initialized')) {
		return;
	}

	$.get('https://randomuser.me/api/', {results: 30}, function (data) {
		var users = [];

		for (var key in data.results) {
			if (data.results.hasOwnProperty(key)) {
				users.push(data.results[key].login.username);

				localStorage.setItem(
					'user_' + data.results[key].login.username,
					JSON.stringify({
						username: data.results[key].login.username,
						password: data.results[key].login.password,
						email: data.results[key].email,
						avatar: data.results[key].picture.medium,
						name: data.results[key].name.first + ' ' + data.results[key].name.last,
						country: data.results[key].nat,
						bio: 'DOB: ' + data.results[key].dob +
							'Phone: ' + data.results[key].phone +
							'Address: ' + data.results[key].location.street +
							'City: ' + data.results[key].location.city + ', ' +
							data.results[key].location.state + ', ' +
							data.results[key].location.postcode
					})
				);
			}
		}

		localStorage.setItem('users', JSON.stringify(users));
		localStorage.setItem('initialized', true);
	});
};

App.prototype.createUser = function() {
	var users = this.getUsers();

	users.push({
		username: $('#signup input[name=username]').val(),
		password: $('#signup input[name=password]').val(),
		email:    $('#signup input[name=email]').val(),
		avatar:   $('#signup input[name=avatar]').val(),
		name:     $('#signup input[name=name]').val(),
		country:  $('#signup input[name=country]').val(),
		bio:      $('#signup input[name=bio]').val(),
	});

	localStorage.setItem('users', JSON.stringify(users));

	window.alert('User created successfully');

	location.href = 'profile.html';
};

jQuery(document).ready(function ($) {
	var app = new App();

	app.initialize();

	$('#signup .form-submit').on('click', function (ev) {
		ev.preventDefault();

		var canProceed = true;
		var fields = $('form#signup').find('input');

		for (var key in fields) {
			if (fields.hasOwnProperty(key)) {
				if ($(fields[key]).attr('required') !== undefined && $(fields[key]).val() === '') {
					window.alert('This field is required: ' + $(fields[key]).attr('name'));
					canProceed = false;
					break
				}
			}
		}

		if (canProceed) {
			app.createUser();
		}
	});
});
