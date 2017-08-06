var app = angular.module('gamecorner', ['ui.router']);

app.factory('games', [function () {
    var o = {
        games: []
    };
    return o;
}])

app.controller('MainCtrl', [
    '$scope',
    'games',
    function ($scope, games) {
        $scope.test = 'Hello gamers!';
        $scope.games = games.games;
        $scope.addGame = function () {
            if (!$scope.title || $scope.title === '') { return; }
            $scope.games.push({ title: $scope.title, link: $scope.link, upvotes: 0, favorite: false });
            $scope.title = '';
            $scope.link = '';
        };
        $scope.incrementUpvotes = function (game) {
            game.upvotes += 1;
        };
    }
]);

app.controller('GameCtrl',[
    '$scope',
    '$stateParams',
    'games',
    function($scope, $stateParams, games){

    }
]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainCtrl'
        });

        $stateProvider.state('games', {
            url: '/games/{id}',
            templateUrl: '/games.html',
            controller: 'GameCtrl'
        });

        $urlRouterProvider.otherwise('home');
    }
]);