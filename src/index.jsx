import React from './ReactCore/react';
import ReactDom from './ReactCore/react-dom';

// import React from './react';
// import ReactDOM from './react-dom';


function Counter() {
  const [count1, setCount1] = React.useState(0)
  const [count2, setCount2] = React.useState(0)

  const handleClick = () => {
    setCount1(count1 + 1)
    setCount2(count2 + 1)
  }

  return (
    <div>
      <p>{count1}</p>
      <p>{count2}</p>
      <p><button onClick={handleClick}>++++++++</button></p>
    </div>
  )
}


const App = <Counter></Counter>
ReactDom.render(App, window.root)