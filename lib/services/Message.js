(function() {
	'use strict';

	var snooze = require('snooze');

	function Message() {};
	
	Message.prototype.id = null;
	Message.prototype.name = null;
	Message.prototype.message = null;

	snooze.module('chatApp')
		.service('Message', function(Util) {
			function createMessage() {
				var M = new Message();
				M.id = Util.randomString(32);

				return M;
			}

			return {
				createMessage: createMessage
			};
		});
})();