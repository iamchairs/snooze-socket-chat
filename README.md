# snooze-socket-chat

A chat room example using snooze-socket.


## Install and Run

Start the server

	git clone https://github.com/iamchairs/snooze-socket-chat
	cd snooze-socket-chat
	npm install
	node main.js

To start the client go to snooze-socket-chat/client/ and open index.html in your prefered browser (Chrome / Firefox / Safari / IE 10+).

Open index.html in multiple tabs to communicate between multiple users.

## Server

### ChatSocket

In this app `socket.io` is included through the `snooze-socket` module. `ChatSocket` is created in `lib/sockets/ChatSocket.js`. `ChatSocket` defines the port to run on as well as which controllers will be handling events.

	(function() {
		'use strict';

		var snooze = require('snooze');

		snooze.module('chatApp')
			.socket('ChatSocket', {
				port: 9876,
				controllers: ['UserCtrl', 'ChatCtrl']
			});
	})();

### UserCtrl

The `UserCtrl` controller creates methods socket connection and disconnect events. When a client connects a new User is created using the `UserManager` and the details for that user is sent out to all listeners. When a client disconnects the `UserManager` finds the User mapped to the disconnected socket and removes it. It then sends out a message alerting all clients that that user has disconnected.

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

### ChatCtrl

The `ChatCtrl` controller handles recieved messages. When the message controller recieves a message it records it along with the name of the client that sent it in the `ChatManager`. After registering the message it sends it out to all listening clients.

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

### Managers and Services

See snooze-socket-chat/lib/services/ for the `UserManager`, `ChatManager`, `User`, and `Message` services.

## Client

The client uses angular to bind to events as well as send out the message event. Connection and disconnect events are sent out automatically behind the scenes (see `socket.io`).

	(function() {
		'use strict';

		console.log('started');

		angular.module('chatApp', [])
			.service('socket', function() {
				var socket = io('http://localhost:9876');
				
				console.log('socket opened');

				return socket;
			})
			.controller('MessagesCtrl', function($scope, socket) {
				$scope.messages = [];

				socket.on('add messages', function(data) {
					console.log(data);
					for(var i = 0; i < data.length; i++) {
						$scope.messages.push(data[i]);
					}

					$scope.$apply();
				});
			})
			.controller('UsersCtrl', function($scope, socket) {
				$scope.users = [];

				function userExists(id) {
					for(var i = 0; i < $scope.users.length; i++) {
						if($scope.users[i].id === id) {
							return true;
						}
					}

					return false;
				};

				socket.on('add users', function(data) {
					for(var i = 0; i < data.length; i++) {
						if(!userExists(data[i].id)) {
							$scope.users.push(data[i]);
						}
					}

					$scope.$apply();
				});

				socket.on('remove users', function(data) {
					for(var i = 0; i < data.length; i++) {
						var user = data[i];

						for(var k = 0; k < $scope.users.length; k++) {
							if($scope.users[k].id === user.id) {
								$scope.users.splice(k, 1);
								break;
							}
						}
					}

					$scope.$apply();
				});
			})
			.controller('NewMessageCtrl', function($scope, socket) {
				$scope.minLength = 8;
				$scope.newMessage = {
					message: ''
				};

				$scope.submit = function() {
					if($scope.newMessage.message.length >= $scope.minLength) {
						socket.emit('message', {message: $scope.newMessage.message});
						$scope.newMessage.message = '';
					}
				};
			});
	})();