(function() {
	'use strict';

	var snooze = require('snooze');

	snooze.module('chatApp')
		.service('UserManager', function(User) {
			var users = [];

			function loginUser(socket) {
				console.log('user added');

				var U = User.createUser();
				U.socket = socket;

				users.push(U);
			}

			function logoutUser(socket) {
				console.log('user removed');

				for(var i = 0; i < users.length; i++) {
					var U = users[i];

					if(U.socket === socket) {
						users.splice(i, 1);
						break;
					}
				}
			}

			function getUserBySocket(socket) {
				for(var i = 0; i < users.length; i++) {
					var U = users[i];

					if(U.socket === socket) {
						return U;
					}
				}
			}

			function getUserDetails(socket) {
				var U = getUserBySocket(socket);

				return {
					id: U.id,
					name: U.name
				};
			}

			function getAllUsersDetails(socket) {
				var details = [];

				for(var i = 0; i < users.length; i++) {
					var user = users[i];
					var socket = user.socket;

					details.push(getUserDetails(socket));
				}

				return details;
			}

			return {
				loginUser: loginUser,
				logoutUser: logoutUser,
				getUserDetails: getUserDetails,
				getAllUsersDetails: getAllUsersDetails
			};
		});
})();