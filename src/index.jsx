import React from './ReactCore/react'

let element = React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  }
}, "hello", React.createElement("span", null, "world"))


console.log(JSON.stringify(element, null, 2))