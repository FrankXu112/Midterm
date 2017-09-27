/* author Yorman */
/* global jQuery */

var App = function () {};

App.prototype.getUsers = function () {
	var users = [];
	var uniques = JSON.parse(localStorage.getItem('users'));

	for (var key in uniques) {
		if (uniques.hasOwnProperty(key)) {
			users.push(JSON.parse(localStorage.getItem('user_' + uniques[key])));
		}
	}

	return users;
};

App.prototype.getUserData = function (username) {
	return JSON.parse(localStorage.getItem('user_' + username));
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
						avatar: data.results[key].picture.large,
						name: data.results[key].name.first + ' ' + data.results[key].name.last,
						country: data.results[key].nat,
						bio: 'DOB: ' + data.results[key].dob + '<br>' +
							'Phone: ' + data.results[key].phone + '<br>' +
							'Address: ' + data.results[key].location.street + '<br>' +
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

	$('#reset_userlist').on('click', function (ev) {
		ev.preventDefault();

		if (confirm('Are you sure that you want to delete the user list?')) {
			var users = app.getUsers();

			for (var key in users) {
				if (users.hasOwnProperty(key)) {
					localStorage.removeItem('user_' + users[key].username);
				}
			}

			localStorage.removeItem('initialized');
			localStorage.removeItem('users');

			location.href = 'index.html';
		}
	});

	if ($('table#userlist').length) {
		var count = 0;
		var users = app.getUsers();

		for (var key in users) {
			if (users.hasOwnProperty(key)) {
				count++;
				$('table#userlist tbody').append('<tr>' +
				'<td>#' + count + '</td>' +
				'<td><img src="' + users[key].avatar + '" alt="' + users[key].name + '"></td>' +
				'<td><span class="username">' + users[key].name + '</span></td>' +
				'<td><a href="mailto:' + users[key].email + '" class="email">' + users[key].email + '</a></td>' +
				'<td><span class="country">' + users[key].country + '</span></td>' +
				'<td><a href="profile.html#username=' + users[key].username + '">view</a></td>' +
				'</tr>');
			}
		}
	}

	if ($('body.profile').length) {
		var username = location.hash.replace('#username=', '');

		if (username === '') {
			location.href = 'userlist.html';
		}

		var user = app.getUserData(username);

		if (user !== null) {
			$('.avatar').html('<img src="' + user.avatar + '">')

			$('.details').append('<ul>' +
			'<li><label>Username:</label><span class="username">' + user.username + '</span></li>' +
			'<li><label>Password:</label><span class="password">' + user.password + '</span></li>' +
			'<li><label>Email:</label><span class="email">' + user.email + '</span></li>' +
			'<li><label>Name:</label><span class="name">' + user.name + '</span></li>' +
			'<li><label>Country:</label><span class="country">' + user.country + '</span></li>' +
			'<li><br><span class="bio">' + user.bio + '</span></li>' +
			'</ul>');
		}
	}
});
