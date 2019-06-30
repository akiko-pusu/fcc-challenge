import React from 'react'

class App extends React.Component {
  constructor() {
    super()
    // this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.watch = this.watch.bind(this)

    this.state = {
      name: '',
      msg: ''
    }
  }

  // the function setState is asynchronous
  // setState() does not always immediately update the component.
  // It may batch or defer the update until later. This makes reading this.state
  // right after calling setState() a potential pitfall. Instead,
  // use componentDidUpdate or a setState callback (setState(updater, callback)),
  // either of which are guaranteed to fire after the update has been applied.
  handleTextChange = e => {
    this.setState({ name: e.target.value }, this.watch)
  }

  // setState callback
  watch = () => {
    this.setState({
      msg: `You name has ${this.state.name.length} characters including space.`
    })
    console.log('changed!')
  }

  handleReset = () => {
    this.setState({ name: '', msg: '' })
  }
  //End Handlers

  render() {
    let msg

    if (this.state.name != '') {
      msg = <p>{this.state.msg}</p>
    } else {
      msg = <p>Please input your name.</p>
    }

    return (
      //do something here where there is a button that will replace the text
      <div>
        <label>Your name </label>
        <input
          type='text'
          id='txtName'
          name='txtName'
          value={this.state.name}
          onChange={this.handleTextChange}
        />
        <button id='btnReset' onClick={this.handleReset}>
          Reset All
        </button>
        <hr />
        { msg }
      </div>
    )
  }
}
export default App
