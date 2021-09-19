import React from './ReactCore/react'
import ReactDom from './ReactCore/react-dom'


export default class RefClass extends React.Component {
  constructor(props) {
    super(props)
    this.aRef = React.createRef()
    this.bRef = React.createRef()
    this.rRef = React.createRef()
  }

  handleAdd = () => {
    const a = this.aRef.current.value
    const b = this.bRef.current.value
    this.rRef.current.value = a + b
  }

  render() {
    return (
      <div>
        <input ref={this.aRef} />+
        <input ref={this.bRef}/>
        <button onClick={this.handleAdd}>=</button>
        <input ref={this.rRef}/>
      </div>
    )
  }
}


const App = <RefClass title="命运之夜"></RefClass>
ReactDom.render(App, window.root)