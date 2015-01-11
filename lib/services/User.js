(function() {
	'use strict';

	var snooze = require('snooze');

	function User() {};
	
	User.prototype.socket = null;
	User.prototype.id = null;
	User.prototype.name = null;

	snooze.module('chatApp')
		.service('User', function(Util) {
			function createUser() {
				var U = new User();
				U.id = Util.randomString(32);
				U.name = 'Guest#' + Util.randomString();

				return U;
			}

			return {
				createUser: createUser
			};
		});
})();