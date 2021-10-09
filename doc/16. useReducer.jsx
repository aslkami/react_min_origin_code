import React from './ReactCore/react';
import ReactDom from './ReactCore/react-dom';

// import React from 'react';
// import ReactDom from 'react-dom';


function reducer(state={number:0}, action) {
  switch (action.type) {
    case 'ADD':
      return {number: state.number + 1};
    case 'MINUS':
      return {number: state.number - 1};
    default:
      return state;
  }
}

function Counter(){
    const [state, dispatch] = React.useReducer(reducer,{number:0});
    return (
        <div>
          Count: {state.number}
          <button onClick={() => dispatch({type: 'ADD'})}>+</button>
          <button onClick={() => dispatch({type: 'MINUS'})}>-</button>
        </div>
    )
}


const App = <Counter></Counter>
ReactDom.render(App, window.root)