var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Player = mongoose.model('Player');
var User = mongoose.model('User');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

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

router.param('player', function(req, res, next, id){
  var query = Player.findById(id);

  query.exec(function(err, player){
    if(err){return next(err);}
    if(!player){return next(new Error('can\'t find player'));
  }
  req.player = player;
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
   var game = new Game(req.body);
   game.save(function(err, game){
     if(err){ return next(err); }
     res.json(game);
   });
});

router.get('/games', function(req, res, next){
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

router.get('/players', function(req, res, next){
  Player.find(function(err, players){
    if(err){return next(err);}
    res.json(players);
  });
});

router.post('/players', function(req, res, next) {
   var player = new Player(req.body);
   player.save(function(err, player){
     if(err){ return next(err); }
     res.json(player);
   });
});

router.get('/players/:player', function(req, res){
  req.player.populate('games', function(err, player){
    if(err){return next(err);}

    res.json(player);
  });
});

router.delete('/players/:player/remove', function(req, res, next){
  req.player.remove(
    function(err, player){
    if(err){return next(err);}
    res.json(player);
  });
});

router.put('/games/:game/players/:player', function(req, res, next){
  var i = 0;
  req.game.players.forEach(function(element) {
    if(element == req.params.player){
    console.log(element + 'en' + req.params.player);
    i++;
  }
  }, this);

  if(i == 0){
    console.log('hey');
  req.game.players.push(req.player);
    req.player.games.push(req.game);
    req.game.save(function(err,game){
      if(err) {return next(err); }
      console.log(game);
      req.player.save(function(err,player){
        if(err){return next(err);}
        console.log(player);
      });
      res.json(game);
  });
  }

});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
