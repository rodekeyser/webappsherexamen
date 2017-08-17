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
  Game.findById(req.params.game, function(err, game){
        if (err){ res.send(err); }

        res.json(game);
    });
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

router.put('/games/:game/update', function(req, res, next){
    var game = req.game;
      game.title = req.body.title;
      game.link = req.body.link;
      game.description = req.body.description;
    game.save(function(err) {
      if(err){ return next(err); }
     res.json(game);
      return next();
    
    });
});

router.put('/games/:game/upvote', function(req, res, next){
    req.game.upvote(function(err, game){
    if(err){return next(err);}

    res.json(game);
  });
});

router.put('/games/:game/downvote', function(req, res, next){
  req.game.downvote(function(err, game){
    if(err){return next(err);}

    res.json(game);
    });
});

router.put('/games/:game/favorite', function(req, res, next){
  req.game.setFavorite(function(err, game){
    if(err){return next(err);}

    res.json(game);
    });
});

router.put('/games/:game/unfavorite', function(req, res, next){
  req.game.setNotFavorite(function(err, game){
    if(err){return next(err);}

    res.json(game);
    });
});

module.exports = router;
