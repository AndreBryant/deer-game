

# Deer Game
Deer game is a semestral project for CMSC 135 (Computer Networking) that applies some networking concepts. This was done with the use of Websockets to implement a Multiplayer game with low latency and real time updates for all connected players.

It follows simple game mechanics. Become a deer and fight others to get the most points before the time runs out. Please see [Installation section](#installation) to deploy the game on your own machines, and go to `How to play` for the full game mechanics.

## Features
- Server can handle multiple simulatenous multiplayer games running at the same time.
- Technically, no limit on the number of players who can join a single game.
- Clean and Intuitive UI

## Installation

Go to root of the project, then

```
npm i
```

once finished, follow these

## How to start development

```
npm run dev
```

if theres nothing running in port 5173, the game should be on `localhost:5173`

to host it in a network, instead of `npm run dev`, you use

```
npm run dev -- --host
```

same for the one above but now, you can access the game if connected to the same network as the machine. you should be able to see `192.168.x.x:5173` <-- this is the link to the game on any devices

## Building the game for production

separate terminals for server and client

Note: you have to do this everytime you are deploying with a specifc wifi connection. You cannot build this with _UP STUDENT_ wifi and still expect the build to run on _UP AP1_

### Server

```
npm run build:backend
```

```
npm run start:backend
```

### Client

```
npm run build
```

if you want to preview the production state of the game.

```
npm run preview -- --host
```
