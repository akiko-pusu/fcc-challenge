// Sound Data Provided by freeCodeCamp
const soundData = [{
  keyCode: 81,
  keyTrigger: 'Q',
  id: 'Heater-1',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3' },
{
  keyCode: 87,
  keyTrigger: 'W',
  id: 'Heater-2',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3' },
{
  keyCode: 69,
  keyTrigger: 'E',
  id: 'Heater-3',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3' },
{
  keyCode: 65,
  keyTrigger: 'A',
  id: 'Heater-4',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3' },
{
  keyCode: 83,
  keyTrigger: 'S',
  id: 'Clap',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
{
  keyCode: 68,
  keyTrigger: 'D',
  id: 'Open-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' },
{
  keyCode: 90,
  keyTrigger: 'Z',
  id: "Kick-n'-Hat",
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3' },
{
  keyCode: 88,
  keyTrigger: 'X',
  id: 'Kick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3' },
{
  keyCode: 67,
  keyTrigger: 'C',
  id: 'Closed-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3' }];



// Component for each pad content (button)
class PadContent extends React.Component {
  constructor(props) {
    super(props);
    this.playSound = this.playSound.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // componentDidMount() is invoked immediately after a 
  // component is mounted
  componentDidMount() {
    // マウントされたタイミングで自分自身にイベントリスナーを定義することができる
    document.addEventListener('keydown', this.handleKeyPress);
  }

  // Don’t forget to unsubscribe in componentWillUnmount().
  // componentDidMountと対で忘れないようにする
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(event) {
    console.log('key pressed!' + event.keyCode + ' ' + this.props.soundData.keyCode);
    if (event.keyCode == this.props.soundData.keyCode) {
      this.playSound();
    }
  }

  playSound(event) {
    const targetText = this.props.soundData.keyTrigger;
    console.log('.....! ' + targetText);

    console.log('callback: ' + this.props);
    this.props.callbackForUpdate(targetText);

    const audioItem = document.getElementById(targetText);
    audioItem.play().then(() => {
      // Automatic playback started!
    }).catch(error => {
      // Automatic playback failed.
      // Show a UI element to let the user manually start playback.
    });
  }

  render() {
    const data = this.props.soundData;
    const keyTrriger = data.keyTrigger;
    const padId = 'pad-' + data.keyTrigger;
    const audioSrc = data.url;
    return (
      React.createElement("div", { className: "drum-pad", id: padId, onClick: this.playSound },
      React.createElement("audio", { className: "clip", id: keyTrriger,
        src: audioSrc }),
      keyTrriger));


  }}


// Q, W, E, A, S, D, Z, X, C.
class DrumPad extends React.Component {
  constructor(props) {
    super(props);
    this.updateDisplay = this.updateDisplay.bind(this);
  }

  updateDisplay(value) {
    console.log('called from pad ' + value);
    this.props.callbackForUpdate(value);
  }

  render() {
    const padItems = [];
    for (let i = 0; i < soundData.length; i++) {
      padItems.push(
      React.createElement(PadContent, { soundData: soundData[i], callbackForUpdate: this.updateDisplay }));

    }

    return (
      React.createElement("div", { id: "pad-container" },
      padItems));


  }}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: '' };

    this.updateDisplay = this.updateDisplay.bind(this);
  }

  updateDisplay(value) {
    console.log('passed!' + value);
    this.setState({ display: value });
  }

  render() {
    const clickedKey = this.state.display == '' ? '' : `Clicked Key: ${this.state.display}`;
    return (
      React.createElement("div", null,
      React.createElement("div", { id: "drum-machine" },
      React.createElement(DrumPad, { callbackForUpdate: this.updateDisplay })),

      React.createElement("div", { id: "display" }, clickedKey)));


  }}


ReactDOM.render(
React.createElement(App, null),
document.getElementById('root'));