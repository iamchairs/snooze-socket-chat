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