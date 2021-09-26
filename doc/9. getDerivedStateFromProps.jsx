import React from './ReactCore/react'
import ReactDom from './ReactCore/react-dom'

// import React from 'react'
// import ReactDom from 'react-dom'


class ChildLifeCircle extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      number: 0
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { count } = nextProps
    if(count % 2 === 0) {
      return { number: count * 2 }
    } else if(count % 3 === 0){
      return { number: count * 3 }
    } else {
      return null
    }
  }

  render() {
    return (
      <p>
        {this.state.number}
      </p>
    )
  }
}

export default class LifeCircleClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return (
      <div>
        <p>{this.state.count}</p>
        <ChildLifeCircle count={this.state.count}/>
        <button onClick={this.handleClick}>++++++</button>
      </div>
    )
  }
}



const App = <LifeCircleClass></LifeCircleClass>
ReactDom.render(App, window.root)

