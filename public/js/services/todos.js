angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/allurls');
			},
			create : function(todoData) {
				return $http.post('/api/newurl', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/url/' + id);
			},
			isLoggedIn : function(user) {
				return $http.get('/api/isLoggedIn', user);
			}
		}
	}]);