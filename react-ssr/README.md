# Setup

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

## Run Hello World!

See: <https://expressjs.com/en/starter/hello-world.html>

### Running Locally

- Create [app.js](./app.js)

```bash
$ node app.js
Example app listening on port 3000!

or

$ npm start

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
