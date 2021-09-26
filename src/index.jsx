import React from './ReactCore/react'
import ReactDom from './ReactCore/react-dom'

// import React from 'react'
// import ReactDom from 'react-dom'



let ThemeContext = React.createContext()
console.log(ThemeContext);

class Header extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{
          margin: '10px',
          border: `5px solid ${this.context.color}`,
          padding: '5px',
        }}>
        header
        <Title />
      </div>
    )
  }
}

class Main extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div
        style={{
          margin: '10px',
          border: `5px solid ${this.context.color}`,
          padding: '5px',
        }}
      >
        header
        <Content />
      </div>
    )
  }
}

class Title extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div
        style={{
          margin: '10px',
          border: `5px solid ${this.context.color}`,
          padding: '5px',
        }}
      >
        title
      </div>
    )
  }
}

class Content extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div 
      style={{
          margin: '10px',
          border: `5px solid ${this.context.color}`,
          padding: '5px',
        }}>
        Content
        <p><button style={{ color: 'green' }} onClick={() => this.context.changeColor('green')}>绿色</button></p>
        <button style={{ color: 'red' }} onClick={() => this.context.changeColor('red')}>红色</button>
      </div>
    )
  }
}
export class ContextClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      color: 'red'
    }
  }

  changeColor = (color) => {
    this.setState({
      color
    })
  }

  render() {
    let value = { color: this.state.color, changeColor: this.changeColor }
    return (
      <ThemeContext.Provider value={value}>
        <div style={{
          margin: '10px',
          border: `5px solid ${this.state.color}`,
          padding: '5px',
          width: '200px'
        }}>
          page
          <Header />
          <Main />
        </div>
      </ThemeContext.Provider>
    )
  }
}


const App = <ContextClass></ContextClass>
ReactDom.render(App, window.root)


// 类组件 
// 父组件 <ThemeContext.Provider value={value} />> 
// 子组件 static contextType = ThemeContext 然后 this.context

// 函数组件 
// 父组件 <ThemeContext.Provider value={value} />
// 子组件 <ThemeContext.Consumer>(value) => value </ThemeContext.Consumer>
