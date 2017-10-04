/* global jQuery */

var App = function () {};

App.prototype.getUsers = function () {
	return JSON.parse(localStorage.getItem('users'));
};

App.prototype.userExists = function () {
	var exists = false;
	var users = this.getUsers();

	for (var i in users) {
		if (users[i].name === 'admin') {
			exists = true;
			break;
		}
	}

	return exists;
};

App.prototype.initialize = function () {
	var data = [
		{
			username: 'admin',
			password: 'password',
			email: 'admin@example.com',
			avatar: 'mark.jpg',
			name: 'Mark Elliot Zuckerberg',
			country: 'United States',
			bio: 'Mark Elliot Zuckerberg (/ˈzʌkərbɜːrɡ/; born May 14, 1984) is an American computer programmer and Internet entrepreneur. He is a co-founder of Facebook, and currently operates as its chairman and chief executive officer. His net worth is estimated to be US$71.5 billion as of September 2017, and he is ranked by Forbes as the fifth richest person in the world.',
		},
		{
			username: 'yorman',
			password: 'yorman',
			email: 'yorman@example.com',
			avatar: 'yorman.jpg',
			name: 'Yorman',
			country: 'Colombia',
			bio: 'Robert "Rob" Pike (born 1956) is a Canadian programmer and author. He is best known for his work at Bell Labs, where he was a member of the Unix team and was involved in the creation of the Plan 9 from Bell Labs and Inferno operating systems, as well as the Limbo programming language. He also co-developed the Blit graphical terminal for Unix; before that he wrote the first window system for Unix in 1981. Pike is the sole inventor named in AT&Ts US patent 4,555,775 or "backing store patent" that is part of the X graphic system protocol and one of the first software patents.',
		},
	];

	if (this.userExists('admin')) {
		return;
	}

	localStorage.setItem('users', JSON.stringify(data));
};

jQuery(document).ready(function ($) {
	var app = new App();

	app.initialize();

	$('#signup .form-submit').on('click', function (ev) {
		ev.preventDefault();
	});
});
