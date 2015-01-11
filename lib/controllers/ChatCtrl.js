(function() {
	'use strict';

	var snooze = require('snooze');

	snooze.module('chatApp')
		.controller('ChatCtrl', {
			message: function($opts, ChatManager) {
				var Msg = ChatManager.addMessage($opts.client, $opts.data.message);
				$opts.socket.emit('add messages', [Msg]);
			}
		});
})();