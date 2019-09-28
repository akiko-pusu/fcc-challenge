'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Sound Data Provided by freeCodeCamp
var soundData = [{
  keyCode: 81,
  keyTrigger: 'Q',
  id: 'Heater-1',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
}, {
  keyCode: 87,
  keyTrigger: 'W',
  id: 'Heater-2',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
}, {
  keyCode: 69,
  keyTrigger: 'E',
  id: 'Heater-3',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
}, {
  keyCode: 65,
  keyTrigger: 'A',
  id: 'Heater-4',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
}, {
  keyCode: 83,
  keyTrigger: 'S',
  id: 'Clap',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
}, {
  keyCode: 68,
  keyTrigger: 'D',
  id: 'Open-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
}, {
  keyCode: 90,
  keyTrigger: 'Z',
  id: "Kick-n'-Hat",
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
}, {
  keyCode: 88,
  keyTrigger: 'X',
  id: 'Kick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
}, {
  keyCode: 67,
  keyTrigger: 'C',
  id: 'Closed-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
}];

// Component for each pad content (button)

var PadContent = function (_React$Component) {
  _inherits(PadContent, _React$Component);

  function PadContent(props) {
    _classCallCheck(this, PadContent);

    var _this = _possibleConstructorReturn(this, (PadContent.__proto__ || Object.getPrototypeOf(PadContent)).call(this, props));

    _this.playSound = _this.playSound.bind(_this);
    _this.handleKeyPress = _this.handleKeyPress.bind(_this);
    return _this;
  }

  // componentDidMount() is invoked immediately after a 
  // component is mounted


  _createClass(PadContent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // マウントされたタイミングで自分自身にイベントリスナーを定義することができる
      document.addEventListener('keydown', this.handleKeyPress);
    }

    // Don’t forget to unsubscribe in componentWillUnmount().
    // componentDidMountと対で忘れないようにする

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeyPress);
    }
  }, {
    key: 'handleKeyPress',
    value: function handleKeyPress(event) {
      console.log('key pressed!' + event.keyCode + ' ' + this.props.soundData.keyCode);
      if (event.keyCode == this.props.soundData.keyCode) {
        this.playSound();
      }
    }
  }, {
    key: 'playSound',
    value: function playSound(event) {
      var targetText = this.props.soundData.keyTrigger;
      console.log('.....! ' + targetText);

      console.log('callback: ' + this.props);
      this.props.callbackForUpdate(targetText);

      var audioItem = document.getElementById(targetText);
      audioItem.play().then(function () {
        // Automatic playback started!
      }).catch(function (error) {
        // Automatic playback failed.
        // Show a UI element to let the user manually start playback.
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var data = this.props.soundData;
      var keyTrriger = data.keyTrigger;
      var padId = 'pad-' + data.keyTrigger;
      var audioSrc = data.url;
      return React.createElement(
        'div',
        { className: 'drum-pad', id: padId, onClick: this.playSound },
        React.createElement('audio', { className: 'clip', id: keyTrriger,
          src: audioSrc }),
        keyTrriger
      );
    }
  }]);

  return PadContent;
}(React.Component);

// Q, W, E, A, S, D, Z, X, C.


var DrumPad = function (_React$Component2) {
  _inherits(DrumPad, _React$Component2);

  function DrumPad(props) {
    _classCallCheck(this, DrumPad);

    var _this2 = _possibleConstructorReturn(this, (DrumPad.__proto__ || Object.getPrototypeOf(DrumPad)).call(this, props));

    _this2.updateDisplay = _this2.updateDisplay.bind(_this2);
    return _this2;
  }

  _createClass(DrumPad, [{
    key: 'updateDisplay',
    value: function updateDisplay(value) {
      console.log('called from pad ' + value);
      this.props.callbackForUpdate(value);
    }
  }, {
    key: 'render',
    value: function render() {
      var padItems = [];
      for (var i = 0; i < soundData.length; i++) {
        padItems.push(React.createElement(PadContent, { soundData: soundData[i], callbackForUpdate: this.updateDisplay }));
      }

      return React.createElement(
        'div',
        { id: 'pad-container' },
        padItems
      );
    }
  }]);

  return DrumPad;
}(React.Component);

var App = function (_React$Component3) {
  _inherits(App, _React$Component3);

  function App(props) {
    _classCallCheck(this, App);

    var _this3 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this3.state = {
      display: ''
    };
    _this3.updateDisplay = _this3.updateDisplay.bind(_this3);
    return _this3;
  }

  _createClass(App, [{
    key: 'updateDisplay',
    value: function updateDisplay(value) {
      console.log('passed!' + value);
      this.setState({ display: value });
    }
  }, {
    key: 'render',
    value: function render() {
      var clickedKey = this.state.display == '' ? '' : 'Clicked Key: ' + this.state.display;
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { id: 'drum-machine' },
          React.createElement(DrumPad, { callbackForUpdate: this.updateDisplay })
        ),
        React.createElement(
          'div',
          { id: 'display' },
          clickedKey
        )
      );
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
