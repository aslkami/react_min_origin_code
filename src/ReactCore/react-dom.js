import { REACT_TEXT } from "./constants";
/**
 * 把 虚拟 dom 变成 真实 dom 插入 容器
 * @param {*} vdom 虚拟 dom
 * @param {*} container 容器
 */
function render(vdom, container) {
  mount(vdom, container); // hooks 需要用
}

function mount(vdom, parentDom) {
  let newDom = createDom(vdom);
  // newDom 可能是 null
  if (newDom) {
    parentDom.appendChild(newDom);
  }
}

/**
 * 把虚拟 dom 变成 真实 dom
 */
function createDom(vdom) {
  if (!vdom) return null;
  let { type, props } = vdom;
  let dom; // 真实 dom

  if (type === REACT_TEXT) {
    // 文本节点
    dom = document.createTextNode(props.content);
  } else {
    dom = document.createElement(type); // div span p
  }

  // 处理属性
  if (props) {
    updateProps(dom, {}, props);
    if (props.children) {
      let children = props.children;
      if (typeof children === "object" && children.type) {
        // 说明是 React 元素
        mount(children, dom); // 子 挂在 父 下面
      } else if (Array.isArray(children)) {
        reconcileChildren(props.children, dom);
      }
    }
  }

  return dom;
}

function reconcileChildren(childrenVdom, parentDom) {
  childrenVdom.forEach((childVdom) => mount(childVdom, parentDom));
}

/**
 * 把新的属性更新到真实 dom 上
 * @param {*} dom 真实 dom
 * @param {*} oldProps  旧属性
 * @param {*} newProps  新属性
 */
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") {
      continue;
    } else if (key === "style") {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else {
      dom[key] = newProps[key];
    }
  }
}

const ReactDom = {
  render,
};

export default ReactDom;
