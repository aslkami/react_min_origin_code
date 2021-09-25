import React from './ReactCore/react'
import ReactDom from './ReactCore/react-dom'

// import React from 'react'
// import ReactDom from 'react-dom'
export default class DomDiffClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: ['A', 'B', 'C', 'D', "E", "F"]
    }
  }

  handleClick = () => {
    this.setState({
      list: ["A", "C", "E", "B", "G"]
    })
  }

  render() {
    return (
      <React.Fragment>
        <ul>
          {
            this.state.list.map(item => <li key={item}>{item}</li>)
          }
        </ul>
        <button onClick={this.handleClick}>change</button>
      </React.Fragment>
    )
  }
}



const App = <DomDiffClass></DomDiffClass>
ReactDom.render(App, window.root)
