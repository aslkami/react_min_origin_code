// import React from './ReactCore/react'
// import ReactDom from './ReactCore/react-dom'

import React from 'react'
import ReactDom from 'react-dom'


export default class GetSnapshotBeforeUpdateClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: []
    }
    this.wrapper = React.createRef();
  }

  addMessage = () => {
    this.setState({
      message: [this.state.message.length ,...this.state.message, ]
    })
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.addMessage()
    }, 1000);
  }

  getSnapshotBeforeUpdate() {
    return {
      prevScrollTop: this.wrapper.current.scrollTop,
      prevScrollHeigt: this.wrapper.current.scrollHeight
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let { prevScrollTop, prevScrollHeigt } = snapshot
    let scrollHeightDiff = this.wrapper.current.scrollHeight - prevScrollHeigt
    this.wrapper.current.scrollTop = prevScrollTop + scrollHeightDiff
  }
  

  render() {
    let style = {
      height: '100px',
      width: '200px',
      border: '1px solid red',
      overflow: 'auto'
    }

    return (
      <div style={style} ref={this.wrapper}>
        {
          this.state.message.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))
        }
      </div>
    )
  }
}

const App = <GetSnapshotBeforeUpdateClass></GetSnapshotBeforeUpdateClass>
ReactDom.render(App, window.root)

