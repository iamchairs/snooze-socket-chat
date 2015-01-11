(function() {
	'use strict';

	var snooze = require('snooze');

	snooze.module('chatApp', ['snooze-socket'])
		.registerEntitiesFromPath('lib/**/*.js')
		.wakeup();
})();