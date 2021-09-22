import React from './ReactCore/react'
import ReactDom from './ReactCore/react-dom'

// import React from 'react'
// import ReactDom from 'react-dom'


class ChildLifeCircle extends React.Component {
  componentWillMount() {
    console.warn("Child will mount");
  }

  componentDidMount() {
    console.warn("Child Mounted");
  }

  componentWillReceiveProps() {
    console.warn("Child Receive Props");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.warn("Child should update");
    return nextProps.count % 3 === 0
  }

  componentWillUnmount() {
    console.warn('Child Will Unmount')
  }

  render() {
    console.warn("Child render");
    return (
      <div>
        {this.props.count}
      </div>
    )
  }
}

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
    console.log("will updated!");
  }

  componentDidUpdate() {
    console.log("updated!");
  }

  render() {
    console.log("render");
    return (
      <div>
        <p>{this.state.count}</p>
        {this.state.count === 4 ? null : <ChildLifeCircle count={this.state.count} />}
        <button onClick={this.handleClick}>++++++</button>
      </div>
    )
  }
}



const App = <LifeCircleClass></LifeCircleClass>
ReactDom.render(App, window.root)


/**

初始化
constructor
will mount
render
Child will mount
Child render
Child Mounted
Mounted

点击 1 次
should update

点击 2 次
should update
will updated!
render
Child Receive Props
Child should update
updated!

点击 3 次
should update

点击 4 次
should update
will updated!
render
Child Will Unmount
updated!

点击 5 次
should update

点击 6 次
should update
will updated!
render
Child will mount
Child render
Child Mounted
updated!
 */