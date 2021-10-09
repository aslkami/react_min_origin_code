import React from "./ReactCore/react";
import ReactDom from "./ReactCore/react-dom";

// import React from 'react';
// import ReactDom from 'react-dom';

const CounterContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return {number: state.number + 1};
    case 'minus':
      return {number: state.number - 1};
    default:
      return state;
  }
}
function Counter(){
  let {state,dispatch} = React.useContext(CounterContext);
  return (
      <div>
        <p>{state.number}</p>
        <button onClick={() => dispatch({type: 'add'})}>+</button>
        <button onClick={() => dispatch({type: 'minus'})}>-</button>
      </div>
  )
}
function Main(){
    const [state, dispatch] = React.useReducer(reducer, {number:0});
    return (
        <CounterContext.Provider value={{state,dispatch}}>
          <Counter/>
        </CounterContext.Provider>
    )
}

const App = <Main />;
ReactDom.render(App, window.root);
