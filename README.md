Shooter game, with socket.io and node.js.

By Lucas Rouret.

[❌] -> No started yet.<br>
[〰️] -> Started.<br>
[❗] -> Bugs O_o.<br>
[✔️] -> Finished.<br>

## Running the app

First, you need to build the code (server and client combined) :

```bash
npm run build-dev
```

Then, you can run the server using : 
```bash
npm run dev
```

Front-end assets won't be updated while the dev server is running, coming soon with Webpack Dev Server.

### Ideas

- Une map plus grande avec des obstacle
- Système de caméra dynamique 
- Système d'arme
- Vie / Shield
- Spawn de joueur 
- Spawn d'arme


### V0.1.4

[❌] -> ajout de nouveaux boostes avec des effets <br>
[❌] -> design des players, bullets et boosts <br>

### V0.1.3 (rc-1)

[✔️] -> added TypeScript suppport <br>
[✔️] -> webpack to build front bundles <br>

### V0.1.2

[✔️] - player can have a name and custom color<br>

### V0.1.1

[✔️] - player can shoot<br>
[✔️] - player can score<br>

### V0.1.0

For players:<br>
[✔️] - a player can move with the mouse<br>
[✔️] - a player can see other players<br>

For developers:<br>
server side:<br>
[✔️] - server can manage multiple players connexion/disconnexion <br>
[✔️] - server can manage multiple players movement<br>
[✔️] - the server send game state to the client when it changes <br>

client side:<br>
[✔️] - the client send the mouse position to the server<br>
[✔️] - the client receive the game state from the server<br>
[✔️] - the client draw the game state<br>
