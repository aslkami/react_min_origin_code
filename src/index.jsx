import React from './ReactCore/react'
import ReactDom from './ReactCore/react-dom'

let element = React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  }
}, "hello", React.createElement("span", null, "world"))


console.log(JSON.stringify(element, null, 2))

ReactDom.render(element, window.root)