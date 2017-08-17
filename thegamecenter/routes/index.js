var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Player = mongoose.model('Player');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('game', function(req, res, next, id){
  var query = Game.findById(id);

  query.exec(function(err, game){
    if(err){return next(err);}
    if(!game){return next(new Error('can\'t find game'));
  }
  req.game = game;
  return next();
  });
});

router.get('/games/:game', function(req, res){
  res.json(req.game);
});

router.post('/games', function(req, res, next) {
console.log('hey');
   var game = new Game(req.body);
   game.save(function(err, game){
     if(err){ return next(err); }
     res.json(game);
   });
});

router.get('/games', function(req, res, next){
  console.log('hey');
  Game.find(function(err, games){
    if(err){return next(err);}
    res.json(games);
  });
});

router.delete('/games/:game/remove', function(req, res, next){

  req.game.remove(
    function(err, game){
    if(err){return next(err);}
    res.json(game);
  });
});



module.exports = router;
