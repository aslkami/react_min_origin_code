import React from './ReactCore/react'
import ReactDom from './ReactCore/react-dom'


export default class StateClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  setCount = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return (
      <div>
        <Fn1 title={this.props.title}/>
        <p>count: {this.state.count}</p>
        <button onClick={this.setCount}>加加</button>
      </div>
    )
  }
}

function Fn1(props) {
  return <Fn2 title={props.title}/>
}

function Fn2(props) {
  return <p>标题: {props.title } </p>
}

const App = <StateClass title="命运之夜"></StateClass>
ReactDom.render(App, window.root)