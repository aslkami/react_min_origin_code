import React from "./ReactCore/react";
import ReactDom from "./ReactCore/react-dom";

// import React from 'react';
// import ReactDom from 'react-dom';

const Animate = () => {
  const ref = React.useRef();
  // React.useLayoutEffect(() => {
  //   ref.current.style.WebkitTransform = `translate(500px)`;
  //   ref.current.style.transition = `all 500ms`;
  // });
  React.useEffect(()=>{
      ref.current.style.WebkitTransform = `translate(500px)`;
      ref.current.style.transition  = `all 500ms`;
  });
  let style = {
    width: "100px",
    height: "100px",
    backgroundColor: "red",
  };
  return (
    <div style={style} ref={ref}>
      我是内容
    </div>
  );
};

const App = <Animate />;
ReactDom.render(App, window.root);
