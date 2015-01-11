(function() {
	'use strict';

	var snooze = require('snooze');

	snooze.module('chatApp')
		.socket('ChatSocket', {
			port: 9876,
			controllers: ['UserCtrl', 'ChatCtrl']
		});
})();