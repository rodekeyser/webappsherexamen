var app = angular.module('gamecorner', ['ui.router']);

app.factory('games', ['$http', function ($http) {
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
        return $http.post('/games', game).success(function(data){
 		  o.games.push(data);
	    });
    };

    o.delete = function(game){
        console.log('check1');
        return $http.delete('/games/' + game._id + '/remove').success(function(data){  
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
        return $http.put('/games/' + id + '/update', game).success(function(data){
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
        return $http.put('/games/' + game._id + '/upvote', null).success(function(data){
        game.upvotes += 1;
        });
    };

    o.downvote = function(game){
        return $http.put('/games/' + game._id + '/downvote', null).success(function(data){
        game.downvotes += 1;
        });
    };

    o.setFavorite = function(game){
        return $http.put('/games/' + game._id + '/favorite', null).success(function(data){
        game.favorite = true;
        });
    };

    o.setUnfavorite= function(game){
        return $http.put('/games/' + game._id + '/unfavorite', null).success(function(data){
        game.favorite = false;
        });
    };

    o.addPlayer = function(playerId, gameId){
        return $http.put('/games/' + gameId + '/players/' + playerId, null).success(function(data){
        });
    };

    return o;
}]);


app.factory('players', ['$http', function ($http) { 
    var p = {
        players: []
    };

    p.getAll = function(){
        return $http.get('/players').success(function(data){
            angular.copy(data, p.players);
        });
    };

    p.create = function(player){
        return $http.post('/players', player).success(function(data){
 		  p.players.push(data);
	    });
    };

    p.get = function(id){
         return $http.get('/players/' + id).then(function(res){
            return res.data;
        });
    };

    p.delete = function(id){
        return $http.delete('/players/' + id + '/remove').success(function(data){  
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

app.controller('MainCtrl', [
    '$scope',
    'games',
    function ($scope, games) {
        $scope.test = 'Hello gamers!';
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
    }
]);

app.controller('GameCtrl',[
    '$scope',
    'games',
    'game',
    'players',
    function($scope, games, game, players){

        $scope.game = game;
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
    function($scope, players){
        $scope.players = players.players;

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
    }
]);

app.controller('PlayerDtlCtrl',[
    '$scope',
    'players',
    'player',
    function($scope, players, player){
        $scope.player = player;
        console.log(player);
    }
]);

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

        $urlRouterProvider.otherwise('home');
    }
]);