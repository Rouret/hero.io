<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="assets/shooter_logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Shooter</h3>

  <p align="center">
    Shooter game
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
	  <a href="#le-projet">Le projet</a>
	  <ul>
		<li><a href="#construit-avec">Construit avec</a></li>
		<li><a href="#installation">Installation</a></li>
	  </ul>
	</li>
	<li>
	  <a href="#roadmap">Roadmap</a>
	</li>
	<li><a href="#contributeurs">Contributeurs</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->

# Le projet

Le jeu shooter est un jeu de tir, dans lequel le joueur contrôle un personnage qui peut tirer sur d'autres joueurs. Le
but du jeu est de tuer le plus de joueurs possible.

Shooter fonctionne sur n'importe quel navigateur, il suffit de se connecter à l'adresse du serveur.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Construit avec

* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Socket.io](https://socket.io/)
* [TypeScript](https://www.typescriptlang.org/)
* [Webpack](https://webpack.js.org/)

## Installation

Pour build

```bash
npm run build-dev
```

Lancer le serveur en dev

```bash
npm run dev
```

## Roadmap

- [x] V0.1.0
    - [x] Les joueurs peuvent se connecter au serveur
    - [x] Les joueurs peuvent se déplacer avec la souris
    - [x] Les joueurs voient les autres joueurs
- [x] V0.1.1
    - [x] Les joueurs peuvent tirer
    - [x] Les joueurs peuvent mourir
    - [x] Les joueurs peuvent gagner des points en tuant des joueurs
- [x] V0.1.2
    - [x] Les joueurs peuvent se connecter avec un pseudo
    - [x] Les joueurs peuvent se connecter avec une couleur
- [x] V0.1.3
    - [x] Ajout de Typescript et webpack
- [x] V0.1.4<br>
  ~~- [ ] restructure du code~~
    - [x] design des players, bullets
    - [x] design landing page
- [x] V0.1.5<br>
  **Les balles et les boost sont désactivés pour se concentrer sur la carte le déplacement etc.**
    - [x] Descativer les boosts (_**temporairement**_)
    - [x] Descativer les balles (**_temporairement_**)
    - [x] Système de caméra dynamique
    - [x] Base de la minimap
    - [x] Affichage de la limite du terrain
    - [x] Correction du bug de déplacement
- [ ] V0.1.6<br>
    - [ ] Mise en place de la première classe

### Effets et classes

- [Effets et Classes](./doc/CLASSES.md)

<!-- CONTRIBUTING -->

## Contributeurs

* [Thibault](https://github.com/joysecc)
* [Tanguy](https://github.com/tanguymossion)
* [Nicolas](https://github.com/nkirchhoffer)


