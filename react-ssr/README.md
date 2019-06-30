# About this directory

Simple application to try to run the React component with Server Side Rendoring.

Thank you so much for this article and sample repository.

- <https://medium.com/@danlegion/react-server-side-rendering-with-express-b6faf56ce22>
- <https://github.com/danleegion/React-SSR>

## Setup

- Update Node.js
- Install express.js
  - <https://expressjs.com>

```bash
$ nvm install v12.5.0
$ node -v
v12.5.0

$ npm init
.....

About to write to /react-ssr/package.json:

{
  "name": "react-ssr",
  "version": "1.0.0",
  "description": "Test application to try Server Side React. ",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "@akiko_pusu",
  "license": "ISC"
}

$ npm install express --save
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN react-ssr@1.0.0 No repository field.

+ express@4.17.1
added 50 packages from 37 contributors and audited 126 packages in 4.055s
found 0 vulnerabilities

react-ssr $ tree -L 1
.
├── README.md
├── node_modules
├── package-lock.json
└── package.json

1 directory, 3 files
```

## Run Hello World

See: <https://expressjs.com/en/starter/hello-world.html>

### Running Locally

- Create [app.js](./app.js)

```bash
$ node app.js
Example app listening on port 3000!

or

$ npm start

```

## Followinf Blog

See: <https://medium.com/@danlegion/react-server-side-rendering-with-express-b6faf56ce22>

To write React, ES6 is used and then, it is required Babel to transpile.

> We will be using ES6, therefore Babel is needed to transpile our code. We need these dependencies for development only and not for production release

```bash
$ npm install --save-dev @babel/cli @babel/core @babel/node @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime @babel/polyfill @babel/preset-env

# create source directory
$ mkdir src
$ touch ./src/server.js

$ npm install compression
.....

npm WARN react-ssr@1.0.0 No repository field.

+ @babel/polyfill@7.4.4
+ @babel/node@7.4.5
+ @babel/plugin-proposal-class-properties@7.4.4
+ @babel/plugin-transform-runtime@7.4.4
+ @babel/cli@7.4.4
+ @babel/core@7.4.5
+ @babel/preset-env@7.4.5
added 370 packages from 173 contributors and audited 3856 packages in 47.064s
found 0 vulnerabilities
```

- Add [.babelrc](./.babelrc), which is required as Babel configuration.
  - Ref: <https://babeljs.io/docs/en/config-files#file-relative-configuration>
  - Specify "node": true or "node": "current", which would be the same as "node": process.versions.node.
    - Ref: <https://babeljs.io/docs/en/babel-preset-env#targetsnode>
- Add task to transpile and run express server in package.json.

> "dev": "nodemon --exec babel-node src/server.js"

Here is an example. nodemon wraps node command and is watching the code.
First, runs babel-node command to transpile, then sends the transoiled code to runs express server.

```bash
$ npm run dev

> react-ssr@1.0.0 dev /Users/akiko/work/fcc-challenge/react-ssr
> nodemon --exec babel-node src/server.js

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `babel-node src/server.js`
Running on 3030...

```

### Add React Component

Create a folder and name it 'component' under the root folder or 'src' and create a jsx file.

```bash
mkdir ./src/components
touch ./src/components/app.jsx

npm install react react-dom handlebars
```


## Note

### Express

> Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

Expressは、最小限のNode.jsベースのWeb applicationのフレームワーク。

> Many popular frameworks are based on Express.

### Testing

``npm init`` command generated the task for test. At first, the result was following:

```bash
$ npm test

> react-ssr@1.0.0 test /react-ssr
> echo "Error: no test specified" && exit 1

Error: no test specified
npm ERR! Test failed.  See above for more details.
```
