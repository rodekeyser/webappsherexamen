var app = angular.module('gamecorner', []);

app.controller('MainCtrl', [
    '$scope',
    function($scope){
        $scope.test = 'Hello gamers!';
        $scope.games = [
            {title:'assassins creed', upvotes:25, favorite: true},
            {title:'mass effect', upvotes:36, favorite: true},
            {title:'fifa', upvotes:60, favorite: false},
            {title:'rocket league', upvotes:12, favorite: false}
        ];
        $scope.addGame = function(){
            $scope.games.push({title:$scope.title, upvotes: 0, favorite: false});
            $scope.title='';
        };
    }
]);