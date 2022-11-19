Shooter game, with socket.io and node.js.

By Lucas Rouret.

[X] -> No started yet.<br>
[~] -> Started.<br>
[KO] -> Bugs O_o.<br>
[Y] -> Finished.<br>

### V0.1.0

For players:<br>
[Y] - a player can move with the mouse<br>
[Y] - a player can see other players<br>

For developers:<br>
server side:<br>
[Y] - server can manage multiple players connexion/disconnexion <br>
[KO] - server can manage multiple players movement<br>
"Currently, the gamestate is only sent if players are moving. So if nobody is moving, the players stop and so the vector calc doenst work "<br><br>
[Y] - the server send game state to the client when it changes <br>

client side:<br>
[Y] - the client send the mouse position to the server<br>
[Y] - the client receive the game state from the server<br>
[Y] - the client draw the game state<br>

