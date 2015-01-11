(function() {
	'use strict';

	var snooze = require('snooze');

	snooze.module('chatApp')
		.service('Util', function() {

			function randomString(len) {
				if(!len) {
					len = 12;
				}

				var chars = 'abcdefghijklmnopqrstuvwxyz0987654321';
				var randStr = '';

				for(var i = 0; i < len; i++) {
					randStr += chars[Math.floor(Math.random()*chars.length)];
				}

				return randStr;
			};

			return {
				randomString: randomString
			};
		});
})();