import { REACT_TEXT, REACT_FORWARD_REF } from "./constants";
import { addEvent } from "./event";
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
    if (newDom._componentDidMount) {
      newDom._componentDidMount();
    }
  }
}

/**
 * 把虚拟 dom 变成 真实 dom
 */
export function createDom(vdom) {
  if (!vdom) return null;
  let { type, props, ref } = vdom;
  let dom; // 真实 dom

  if (type && type.$$type === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
    // 文本节点
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
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

  vdom.dom = dom; // 让 虚拟 dom 记录真实 dom
  if (ref) {
    ref.current = dom;
  }
  return dom;
}

function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom; // 记录上一次函数返回值
  return createDom(renderVdom);
}

function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  let classInstance = new ClassComponent(props);
  if (ref) {
    ref.current = classInstance;
  }
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
  }
  let renderVdom = classInstance.render();
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom; // 记录上一次函数返回值
  const dom = createDom(renderVdom);
  if (classInstance.componentDidMount) {
    dom._componentDidMount =
      classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}

function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type(props);
  vdom.oldRenderVdom = renderVdom; // 记录上一次函数返回值
  return createDom(renderVdom);
}

// 递归孩子
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
    } else if (key.startsWith("on")) {
      // dom[key.toLocaleLowerCase()] = newProps[key];
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
}

export function findDom(vdom) {
  if (!vdom) return null;
  if (vdom.dom) {
    return vdom.dom;
  } else {
    // 函数 类组件没有 真实 dom 但是有虚拟 oldRenderVdom
    return findDom(vdom);
  }
}

export function compateTwoVdom(parentDom, oldVDom, newVdom) {
  let oldDom = findDom(oldVDom); // 获取 oldRenderVdom 对应的 真实 dom
  let newDom = createDom(newVdom); // 创建 新的 dom
  parentDom.replaceChild(newDom, oldDom);
}

const ReactDom = {
  render,
};

export default ReactDom;
