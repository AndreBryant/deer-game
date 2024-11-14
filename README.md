# How to start development

go to root of the project, then

```
npm i
```

once finished,

```
npm run dev
```

if theres nothing running in port 5173, the game should be on `localhost:5173`

to host it in a network, instead of `npm run dev`, you use

```
npm run dev -- --host
```

same for the one above but now, you can access the game if connected to the same network as the machine. you should be able to see `192.168.x.x:5173` <-- this is the link to the game on any devices

# Building the game for production

separate terminals for server and client
Note: you have to do this everytime you are deploying with a specifc wifi connection. You cannot build this with _UP STUDENT_ wifi and still expect the build to run on _UP AP1_
**Server:**

```
npm run build:backend
```

```
npm run start:backend
```

**Client:**

```
npm run build
```

if you want to preview the production state of the gaem.

```
npm run preview -- --host
```

<!-- # create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment. -->
