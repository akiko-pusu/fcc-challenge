import React from 'react'
// Only import method
// import { hydrate } from 'react-dom'
import ReactDOM from 'react-dom'
import App from './app'

/*
Same as render(), but is used to hydrate a container whose HTML contents
were rendered by ReactDOMServer.
React will attempt to attach event listeners to the existing markup.

Ref.https://reactjs.org/docs/react-dom.html#hydrate

SSRの場合は、ReactDOM.render() -> ReactDOM.hydrate() にする
*/
ReactDOM.hydrate(<App />, document.getElementById('reactele'))
