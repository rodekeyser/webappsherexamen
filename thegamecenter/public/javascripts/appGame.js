var app = angular.module('gamecorner', ['ui.router']);


app.factory('games', ['$http', 'auth', function ($http, auth) {
    var o = {
        games: []
    };

    o.getAll = function(){
        return $http.get('/games').success(function(data){
            angular.copy(data, o.games);
        });
    };

    o.get = function(id){
        return $http.get('/games/' + id).then(function(res){
            return res.data;
        });
    };

    o.create = function(game){
        return $http.post('/games', game, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
 		  o.games.push(data);
	    });
    };

    o.delete = function(game){
        console.log('check1');
        return $http.delete('/games/' + game._id + '/remove', {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){  
            o.games.forEach(function(element) {
                if(element._id == data._id){
                    var index = o.games.indexOf(element);
                    o.games.splice(index);
                    console.log(o.games);
                }
            }, this);
        });
    };

    o.update = function(id, game){
        console.log(game);
        return $http.put('/games/' + id + '/update', game,{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
            o.games.forEach(function(element) {
                if(element._id == data._id){
                    var index = o.games.indexOf(element);
                    o.games.splice(index);
                    o.games.push(data);
                    console.log(o.games);
                }
            }, this);
        });
    };

    o.upvote = function(game){
        return $http.put('/games/' + game._id + '/upvote', null,{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        game.upvotes += 1;
        });
    };

    o.downvote = function(game){
        return $http.put('/games/' + game._id + '/downvote', null,{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        game.downvotes += 1;
        });
    };

    o.setFavorite = function(game){
        return $http.put('/games/' + game._id + '/favorite', null,{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        game.favorite = true;
        });
    };

    o.setUnfavorite= function(game){
        return $http.put('/games/' + game._id + '/unfavorite', null,{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        game.favorite = false;
        });
    };

    o.addPlayer = function(playerId, gameId){
        return $http.put('/games/' + gameId + '/players/' + playerId, null,{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        });
    };

    return o;
}]);


app.factory('players', ['$http', 'auth', function ($http, auth) { 
    var p = {
        players: []
    };

    p.getAll = function(){
        return $http.get('/players').success(function(data){
            angular.copy(data, p.players);
        });
    };

    p.create = function(player){
        return $http.post('/players', player,{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
 		  p.players.push(data);
	    });
    };

    p.get = function(id){
         return $http.get('/players/' + id).then(function(res){
            return res.data;
        });
    };

    p.delete = function(id){
        return $http.delete('/players/' + id + '/remove',{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){  
            p.players.forEach(function(element) {
                if(element._id == data._id){
                    var index = p.players.indexOf(element);
                    p.players.splice(index);
                }
            }, this);
        });
    };

    return p;
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};
  auth.saveToken = function (token){
    $window.localStorage['gamecorner-token'] = token;
  };

  auth.getToken = function (){
    return $window.localStorage['gamecorner-token'];
  };
  auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user){
      console.log(user);
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('gamecorner-token');
  };

  return auth;
}]);

app.controller('MainCtrl', [
    '$scope',
    'games',
    'auth',
    function ($scope, games, auth) {
        $scope.test = 'Hello gamers!';
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.games = games.games;
        $scope.addGame = function () {
            if (!$scope.title || $scope.title === '') { return; }
            games.create({
                title: $scope.title,
                link: $scope.link,
                description : $scope.description
            });
            $scope.title = '';
            $scope.link = '';
            $scope.description = '';
        };
        $scope.incrementUpvotes = function (game) {
            games.upvote(game);
        };
        $scope.incrementDownvotes = function(game){
            games.downvote(game);
        };
        $scope.setFavorite = function(game){
            games.setFavorite(game);
        };
        $scope.setNotFavorite = function(game){
            games.setUnfavorite(game);
        };
        $scope.deleteGame = function(game){
            games.delete(game);
            $scope.games = games.games;
        };
        $scope.isAuthorized = function(game){
            return game.author === auth.currentUser();
        };
    }
]);

app.controller('GameCtrl',[
    '$scope',
    'games',
    'game',
    'players',
    'auth',
    function($scope, games, game, players,auth){
        $scope.game = game;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.players = players.players;
        $scope.updateGame = function(title, link, description){
            games.update( $scope.game._id ,{
                title: $scope.title,
                description: $scope.description,
                link: $scope.link
            });
        };
        $scope.addPlayer=function(){
            games.addPlayer($scope.selectedPlayer, $scope.game._id);
        };
    }
]);

app.controller('PlayerCtrl', [
    '$scope',
    'players',
    'auth',
    function($scope, players, auth){
        $scope.players = players.players;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.addPlayer = function(){
            if (!$scope.userName || $scope.userName === '') { return; }
            players.create({
                userName: $scope.userName,
                realName: $scope.realName,
                age : $scope.age
            });
            $scope.userName = '';
            $scope.realName = '';
            $scope.age = '';
        };
        $scope.deletePlayer = function(player){
            players.delete(player._id);
            $scope.players = players.players;
        }
        $scope.isAuthorized = function(player){
            return player.author === auth.currentUser();
        };
    }
]);

app.controller('PlayerDtlCtrl',[
    '$scope',
    'players',
    'player',
    'auth',
    function($scope, players, player, auth){
        $scope.player = player;
        $scope.isLoggedIn = auth.isLoggedIn;
        console.log(player);
    }
]).directive('gamedetail', function(){
    return {
    templateUrl: '/my-game.html'
  };
});

app.controller('AuthCtrl', [
  '$scope',
  '$state',
  'auth',
  function($scope, $state, auth){
    $scope.user = {};

    $scope.register = function(){
      auth.register($scope.user).error(function(error){
        $scope.error = error;
      }).then(function(){
        $state.go('home');
      });
    };

    $scope.logIn = function(){
      auth.logIn($scope.user).error(function(error){
        $scope.error = error;
      }).then(function(){
        $state.go('home');
      });
    };
  }]);

app.controller('NavCtrl', [
  '$scope',
  'auth',
  function($scope, auth){
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
  }]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainCtrl',
            resolve: {
                gamePromise: ['games', function(games){
                    return games.getAll();
                }]
            }
        });

        $stateProvider.state('games', {
            url: '/games/{id}',
            templateUrl: '/games.html',
            controller: 'GameCtrl',
            resolve: {
                game:['$stateParams', 'games', function($stateParams, games){
                    return games.get($stateParams.id);
                }],
                playerPromise: ['players', function(players){
                    return players.getAll();
                }]
            }
        });

        $stateProvider.state('players', {
            url: '/players',
            templateUrl: '/players.html',
            controller: 'PlayerCtrl',
            resolve: {
                playerPromise: ['players', function(players){
                    return players.getAll();
                }]
            }
        });

        $stateProvider.state('playerDetail', {
            url: '/players/detail/{id}',
            templateUrl: '/players/detail.html',
            controller: 'PlayerDtlCtrl',
            resolve: {
                player:['$stateParams', 'players', function($stateParams, players){
                    return players.get($stateParams.id);
                }]
            }
        });

        $stateProvider.state('login', {
      url: '/login',
      templateUrl: '/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

    $stateProvider.state('register', {
      url: '/register',
      templateUrl: '/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

        $urlRouterProvider.otherwise('home');
    }
]);