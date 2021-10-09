import React from "./ReactCore/react";
import ReactDom from "./ReactCore/react-dom";

// import React from 'react';
// import ReactDom from 'react-dom';
function Child(props, ref) {
  const inputRef = React.useRef();
  React.useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));
  return <input type="text" ref={inputRef} />;
}
const ForwardChild = React.forwardRef(Child);
function Parent() {
  let [number, setNumber] = React.useState(0);
  const inputRef = React.useRef();
  function getFocus() {
    console.log(inputRef.current);
    inputRef.current.value = "focus";
    inputRef.current.focus();
  }
  return (
    <div>
      <ForwardChild ref={inputRef} />
      <button onClick={getFocus}>获得焦点</button>
      <p>{number}</p>
      <button
        onClick={() => {
          debugger;
          setNumber(number + 1);
        }}
      >
        +
      </button>
    </div>
  );
}

const App = <Parent />;
ReactDom.render(App, window.root);
