(function() {
	'use strict';

	var snooze = require('snooze');

	snooze.module('chatApp')
		.controller('UserCtrl', {
			connection: function($opts, UserManager, ChatManager) {
				UserManager.loginUser($opts.client);

				var User = UserManager.getUserDetails($opts.client);
				$opts.socket.emit('add messages', [ChatManager.createSystemMessage(User.name + ' Connected')]);

				$opts.socket.emit('add users', [UserManager.getUserDetails($opts.client)]);
				$opts.client.emit('add users', UserManager.getAllUsersDetails());
				$opts.client.emit('add messages', ChatManager.getAllMessages());
			},
			disconnect: function($opts, UserManager, ChatManager) {
				$opts.socket.emit('remove users', [UserManager.getUserDetails($opts.client)]);

				var User = UserManager.getUserDetails($opts.client);
				$opts.socket.emit('add messages', [ChatManager.createSystemMessage(User.name + ' Disconnected')]);

				UserManager.logoutUser($opts.client);
			}
		});
})();