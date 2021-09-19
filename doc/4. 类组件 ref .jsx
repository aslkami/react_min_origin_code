import React from './ReactCore/react'
import ReactDom from './ReactCore/react-dom'


class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  getFocus = () => {
    this.inputRef.current.focus()
  }

  render() {
    return (
      <input ref={this.inputRef}/>
    )
  }
}
export default class RefClass extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  getFocus = () => {
    this.inputRef.current.getFocus()
  }

  render() {
    return (
      <div>
        <TextInput ref={this.inputRef}/>
        <button onClick={this.getFocus}>获取焦点</button>
      </div>
    )
  }
}

const App = <RefClass title="命运之夜"></RefClass>
ReactDom.render(App, window.root)