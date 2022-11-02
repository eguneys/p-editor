## Using pnpm, creating a vite project, and installing "blah" typescript dependency

Install [NodeJs](https://nodejs.org/) first, so it prints out a version number like this.

```
$ node --version
v18.4.0
```

Install [pnpm](https://pnpm.io/) second, so it prints out a version number like this.

```
$ pnpm --version
7.14.0
```

We will create a [Vite](https://vitejs.dev/) project that uses Typescript.


```
$ pnpm create vite
```

Type in a project name and, select Typescript and Vanilla, so we have no dependencies.

Run `pnpm install` in the project folder to install the dev dependencies.

Setup the npm scripts in `package.json` to listen on a custom port, and check for type errors as we save.

`package.json`

```js
{
  /* extra config */
  "scripts": {
    "dev": "vite --port=3000",
    "build": "vite build",
    "lint": "tsc --noEmit --watch"
  },
}
```

Remove all files in `src` folder and create a new file called `main.ts`:

`main.ts`

```
const app = (element: HTMLElement) => {
  console.log(element)
}

app(document.getElementById('app')!)
export default app
```

Run `pnpm dev` and visit `http://localhost:3000` to check the console that it logs the DOM element.
Optionally run `pnpm lint` to continously watch for type errors as we develop.

Except we will install the "blah rewrite in Typescript" dependency. It's not available through npm so we clone the repository, build and link it locally.


```
git clone https://github.com/eguneys/blah
cd blah
pnpm install
pnpm build
```


Now we can go back to our project and install "blah" dependency. Go to your previously created project folder and add "blah" as dependency to the `package.json`.


`package.json`
```js
{
  /* extra config */
  "dependencies": {
    "blah": "link:../blah"
  }
}
```


Finally run `pnpm install` again now you can import the "blah rewritten in Typescript" framework like so:

```js
import { App } from "blah"
```

Next, you can more about how to use this framework in [README.md](README.md)
