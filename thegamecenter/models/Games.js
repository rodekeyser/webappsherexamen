var mongoose = require('mongoose');


var GameSchema = new mongoose.Schema({
    title: String,
    link: String,
    description: String,
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
    favorite: {type: Boolean, default: false },
    players: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'}
});

GameSchema.methods.upvote = function(cb)
{
  this.upvotes += 1;
  this.save(cb);
};

GameSchema.methods.downvote = function(cb)
{
  this.downvotes += 1;
  this.save(cb);
};

GameSchema.methods.setFavorite = function(cb)
{
  this.favorite = true;
  this.save(cb);
};

GameSchema.methods.setNotFavorite = function(cb)
{
  this.favorite = false;
  this.save(cb);
};

mongoose.model('Game', GameSchema);