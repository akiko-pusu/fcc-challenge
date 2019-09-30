/* global React, ReactDOM */
/* eslint-disable react/prop-types, react/no-multi-comp,
                              no-eval, no-nested-ternary */

// #clear
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 0,
      digits: [],
      keyInput: [] };

    this.generateDisplayValue = this.generateDisplayValue.bind(this);
    this.clearDisplay = this.clearDisplay.bind(this);
    this.numberDisplay = this.numberDisplay.bind(this);
    this.setOperator = this.setOperator.bind(this);
    this.calculate = this.calculate.bind(this);
    this.addDigits = this.addDigits.bind(this);
  }

  clearDisplay(event) {
    this.setState({ display: 0, digits: [], keyInput: [] });
  }

  // 計算結果やボタン入力による表示を実施
  generateDisplayValue(value) {
    let newValue = this.state.display + value;
    newValue = newValue.replace(/^0/, '');
    return newValue;
  }

  numberDisplay(event) {
    const inputNumber = event.target.innerText;
    const newDigits = this.addDigits(inputNumber, this.state.digits);

    // 入力内容が処理対象のキーによって更新されていたら、表示関連のstateも更新する
    if (newDigits.toString() != this.state.digits.toString()) {
      const keyInput = [...this.state.keyInput];
      keyInput.push(inputNumber);
      this.setState({ digits: [...newDigits],
        keyInput: keyInput,
        display: this.generateDisplayValue(inputNumber) });


    }
  }

  safeEval(val) {
    return Function('"use strict";return (' + val + ')')();
  }

  // 演算子の入力
  setOperator(event) {
    const inputOperator = event.target.innerText;
    let keyInput = [...this.state.keyInput];

    // 直前の入力データが＝を含む集計結果だった場合は、入力データをクリアして集計結果のみにする
    if (this.state.keyInput.indexOf('=') > -1) {
      const newVal = [...this.state.keyInput].pop();
      keyInput = [newVal];
    }
    const newDigits = this.addDigits(inputOperator, this.state.digits);

    keyInput.push(inputOperator);
    this.setState({ digits: [...newDigits], keyInput: keyInput, display: inputOperator });
  }

  // 実際の計算
  calculate(event) {
    let calculateText = this.state.digits.join('');
    calculateText = calculateText.replace(/(\+|\*|\/+)(\-)(\+|\*|\/)(\d)/g, '$3$4').replace(/(\+|\-){2,}(\d)/g, '$1$2');
    const value = this.safeEval(calculateText);
    let keyInput = [...this.state.keyInput];
    keyInput.push('=');
    keyInput.push(value);
    this.setState({ keyInput: keyInput, display: value, digits: [value] });
  }

  /* 入力された値をチェックして登録: 有効な入力値の入った配列を返す */
  addDigits(value, digits) {
    const operators = /\-|\+|\*|\//;
    let newDigits = [...digits];

    // 入力データの直前の1つを取得
    let lastDigit = [...digits].pop();

    // 0のみ入力されていて、追加データも0の場合は値は増やさない
    if (newDigits.length == 1 && parseInt(lastDigit) == 0 && parseInt(value) == 0) {
      return newDigits;
    }

    if (newDigits.length == 1 && parseInt(lastDigit) == 0 && parseInt(value) != 0) {
      return [value];
    }

    /* 12.45 + 12.3 に対して追加で '.' が来た場合：　演算子で分割し、直前の数字文字列に '.' が入っていたら変更しない */
    if (value == '.') {
      const lastNumber = [...digits.join('').split(operators)].pop();
      if (lastNumber.indexOf('.') > -1) {
        return newDigits;
      }
    }

    newDigits.push(value);
    return newDigits;
  }

  render() {
    return (
      React.createElement("div", { id: "app" },
      React.createElement("div", { id: "clear", className: "button ac", onClick: this.clearDisplay }, "AC"),
      React.createElement("div", { id: "divide", className: "button divide", onClick: this.setOperator }, "/"),
      React.createElement("div", { id: "multiply", className: "button multiply", onClick: this.setOperator }, "*"),
      React.createElement("div", { id: "seven", className: "button seven", onClick: this.numberDisplay }, "7"),
      React.createElement("div", { id: "eight", className: "button eight", onClick: this.numberDisplay }, "8"),
      React.createElement("div", { id: "nine", className: "button nine", onClick: this.numberDisplay }, "9"),
      React.createElement("div", { id: "subtract", className: "button subtract", onClick: this.setOperator }, "-"),
      React.createElement("div", { id: "four", className: "button four", onClick: this.numberDisplay }, "4"),
      React.createElement("div", { id: "five", className: "button five", onClick: this.numberDisplay }, "5"),
      React.createElement("div", { id: "six", className: "button six", onClick: this.numberDisplay }, "6"),
      React.createElement("div", { id: "add", className: "button add", onClick: this.setOperator }, "+"),
      React.createElement("div", { id: "one", className: "button one", onClick: this.numberDisplay }, "1"),
      React.createElement("div", { id: "two", className: "button two", onClick: this.numberDisplay }, "2"),
      React.createElement("div", { id: "three", className: "button three", onClick: this.numberDisplay }, "3"),
      React.createElement("div", { id: "equals", className: "button equals", onClick: this.calculate }, "="),
      React.createElement("div", { id: "zero", className: "button zero", onClick: this.numberDisplay }, "0"),
      React.createElement("div", { id: "decimal", className: "button decimal", onClick: this.numberDisplay }, "."),
      React.createElement("div", { className: "button displayWrapper" },
      React.createElement("div", { id: "display" }, this.state.display)),

      React.createElement("div", { className: "button displayWrapper" },
      React.createElement("div", { id: "formula" }, this.state.keyInput.join('')))));



  }}


ReactDOM.render(
React.createElement(App, null),
document.getElementById('root'));
