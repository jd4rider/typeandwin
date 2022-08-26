const express = require('express');

const cors = require('cors');

const app = express();

const socketio = require('socket.io');

const mongoose = require('mongoose');

const expressServer = app.listen(3001);

const io = socketio(expressServer, {cors: {origin: '*'}});

const Game = require('./Models/Game');
const QuotableAPI = require('./QuotableAPI');

mongoose.connect('mongodb://localhost:27017/typeandwin', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('connected to mongodb');
})

io.on('connect', (socket) => {

  socket.on('join-game', async ({gameID : _id, nickName}) => {
    try{
       let game = await Game.findOne({_id});
       if(game.isOpen){
         const gameID = game._id.toString();
         socket.join(gameID);
         let player = {
            socketID: socket.id,
            nickName
         };
          game.players.push(player);
          game = await game.save();
          io.to(gameID).emit('updateGame', game);
       }
    }catch(err){console.log(err)}
  });

  socket.on('create-game', async (nickName) => {
    try{
      const quotableData = await QuotableAPI();
      let game = new Game();
      game.words = quotableData;
      let player = {
        socketID: socket.id,
        isPartyLeader: true,
        nickName
      }
      game.players.push(player);
      game = await game.save();

      const gameID = game._id.toString();
      socket.join(gameID);
      io.to(gameID).emit('updateGame', game);

    }catch(err){console.log(err)}
  })
});
