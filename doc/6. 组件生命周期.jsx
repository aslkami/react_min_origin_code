import React from './ReactCore/react'
import ReactDom from './ReactCore/react-dom'

export default class LifeCircleClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
    console.log("constructor");
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 })
  }

  componentWillMount() {
    console.log("will mount");
  }

  componentDidMount() {
    console.log("Mounted");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("should update");
    return nextState.count % 2 === 0
  }

  componentWillUpdate() {
    console.info("will updated!");
  }

  componentDidUpdate() {
    console.error("updated!");
  }

  render() {
    console.warn("render");
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={this.handleClick}>++++++</button>
      </div>
    )
  }
}

const App = <LifeCircleClass></LifeCircleClass>
ReactDom.render(App, window.root)