import React from './ReactCore/react';
import ReactDom from './ReactCore/react-dom';

// import React from 'react';
// import ReactDom from 'react-dom';


function Child(props) {
  console.log("Child Render");
  return <button onClick={props.handleClick}>{props.data.count}</button>
}

const ReactMemoChild = React.memo(Child)

function Counter() {
  console.log('Parent Render');
  const [count, setCount] = React.useState(0)
  const [value, setValue] = React.useState('')

  // let data = {
  //   count
  // }

  // let handleClick = () => setCount(count + 1)
  let data = React.useMemo(() => {
    return {
      count
    }
  }, [count])

  let handleClick = React.useCallback(() => {
    setCount(count + 1)
  }, [count])

  return (
    <div className="parent">
      <input value={value} onChange={e => setValue(e.target.value)} />
      <ReactMemoChild data={data} handleClick={handleClick}/>
    </div>
  )
}


const App = <Counter></Counter>
ReactDom.render(App, window.root)