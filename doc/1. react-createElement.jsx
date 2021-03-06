import React from './ReactCore/react'
import ReactDom from './ReactCore/react-dom'

let element = React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  }
}, "hello", React.createElement("span", null, "world"))


console.log(JSON.stringify(element, null, 2))


function Fn1(props) {
  return <h1>{props.title}  世界 ！</h1>
}

// function Fn() {
//   return <Fn1 title="你好" />
// }

// let element2 = React.createElement(Fn, { title: '标题' })

class Fate extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <Fn1 title="Saber"/>
      </div>
    )
  }
}

let element3 = React.createElement(Fate, { title: '命运之夜' })

ReactDom.render(element3, window.root)
