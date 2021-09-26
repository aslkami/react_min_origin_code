import {
  REACT_TEXT,
  REACT_FORWARD_REF,
  REACT_FRAGMENT,
  MOVE,
  PLACEMENT,
  DELETE,
} from "./constants";
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
  } else if (type === REACT_FRAGMENT) {
    dom = document.createDocumentFragment();
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
        children._mountIndex = 0;
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
  vdom.classInstance = classInstance; // 类组件实例挂在 对应 的 vdom 上
  let renderVdom = classInstance.render();
  // classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom; // 记录上一次函数返回值
  classInstance.oldRenderVdom = renderVdom; // 记录上一次函数返回值
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
  childrenVdom.forEach((childVdom, index) => {
    childVdom._mountIndex = index;
    mount(childVdom, parentDom);
  });
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

  for (let key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      dom[key] = null;
    }
  }
}

export function findDom(vdom) {
  if (!vdom) return null;
  if (vdom.dom) {
    return vdom.dom;
  } else {
    // 函数 类组件没有 真实 dom 但是有虚拟 oldRenderVdom
    let renderVdom = vdom.classInstance
      ? vdom.classInstance.oldRenderVdom
      : vdom.oldRenderVdom;
    return findDom(renderVdom);
  }
}

// export function compateTwoVdom(parentDom, oldVDom, newVdom) {
//   let oldDom = findDom(oldVDom); // 获取 oldRenderVdom 对应的 真实 dom
//   let newDom = createDom(newVdom); // 创建 新的 dom
//   parentDom.replaceChild(newDom, oldDom);
// }

// dom-diff
export function compateTwoVdom(parentDom, oldVDom, newVdom, nextDom) {
  // 都为
  if (!oldVDom && !newVdom) {
    return null;
  } else if (!!oldVDom && !newVdom) {
    // 老的有， 新的没有
    umMountVdom(oldVDom);
  } else if (!oldVDom && !!newVdom) {
    // 老的没有， 新的有
    let newDom = createDom(newVdom);
    if (nextDom) {
      //  有可能在中间
      parentDom.insertBefore(newDom, nextDom);
    } else {
      parentDom.appendChild(newDom);
    }

    if (newDom._componentDidMount) {
      newDom._componentDidMount();
    }
  } else if (!!oldVDom && !!newVdom && oldVDom.type !== newVdom.type) {
    // 老的有 新的也有， 但是 类型不同
    umMountVdom(oldVDom);
    let newDom = createDom(newVdom);
    if (nextDom) {
      //  有可能在中间
      parentDom.insertBefore(newDom, nextDom);
    } else {
      parentDom.appendChild(newDom);
    }
    if (newDom._componentDidMount) {
      newDom._componentDidMount();
    }
  } else {
    // 老的有 新的也有， 类型相同， 深度对比子节点的流程
    updateElement(oldVDom, newVdom);
  }
}

function umMountVdom(vdom) {
  let { props, ref } = vdom;
  let currentDom = findDom(vdom); // 获取 虚拟组件 对应的 真实 dom
  // vdom 可能是 原生组件 span 类组件 也可能是 函数组件
  if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
    vdom.classInstance.componentWillUnmount();
  }
  if (ref) {
    vdom.ref.current = null;
  }
  // 取消监听函数
  Object.keys(props).forEach((propName) => {
    if (propName.slice(0, 2) === "on") {
      delete currentDom._store;
      // 事件绑定在 真实 dom 上 这么写
      const eventName = propName.slice(2).toLowerCase();
      currentDom.removeEventListener(eventName, props[propName]);
    }
  });
  // 递归卸载子组件
  if (props.children) {
    let children = Array.isArray(props.children)
      ? props.children
      : [props.children];
    children.forEach(umMountVdom);
  }
  // 卸载完子组件 卸载自身
  currentDom.parentNode.removeChild(currentDom);
}

function updateElement(oldVDom, newVdom) {
  if (oldVDom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
    let currentDom = (newVdom.dom = findDom(oldVDom));
    // 如果新老节点都是 纯文本节点
    if (oldVDom.props.content !== newVdom.props.content) {
      currentDom.textContent = newVdom.props.content;
    }
  } else if (oldVDom.type === REACT_FRAGMENT) {
    let currentDom = (newVdom.dom = findDom(oldVDom));
    updateChildren(currentDom, oldVDom.props.children, newVdom.props.children);
  } else if (typeof oldVDom.type === "string") {
    // span, div 且类型一样，服用 老的 dom 节点
    let currentDom = (newVdom.dom = findDom(oldVDom));
    updateProps(currentDom, oldVDom.props, newVdom.props);
    updateChildren(currentDom, oldVDom.props.children, newVdom.props.children);
  } else if (typeof oldVDom.type === "function") {
    if (oldVDom.type.isReactComponent) {
      updateClassComponent(oldVDom, newVdom);
    } else {
      updateFunctionComponent(oldVDom, newVdom);
    }
  }
}

// function updateChildren(parentDom, oldVChildren, newVChildren) {
//   oldVChildren = Array.isArray(oldVChildren)
//     ? oldVChildren
//     : oldVChildren
//     ? [oldVChildren]
//     : [];
//   newVChildren = Array.isArray(newVChildren)
//     ? newVChildren
//     : newVChildren
//     ? [newVChildren]
//     : [];

//   // 简单的一一对比
//   let maxChildrenLength = Math.max(oldVChildren.length, newVChildren.length);
//   for (let i = 0; i < maxChildrenLength; i++) {
//     // 试图取出当前的节点的 下一个， 最近的弟弟真实 DOM 节点
//     let nextVdom = oldVChildren.find(
//       (item, index) => index > i && item && findDom(item)
//     );
//     compateTwoVdom(
//       parentDom,
//       oldVChildren[i],
//       newVChildren[i],
//       findDom(nextVdom)
//     );
//   }
// }

/**
 * dom-diff 算法
 * @param {*} parentDom
 * @param {*} oldVChildren
 * @param {*} newVChildren
 */
function updateChildren(parentDom, oldVChildren, newVChildren) {
  console.log(newVChildren);
  oldVChildren = Array.isArray(oldVChildren)
    ? oldVChildren
    : oldVChildren
    ? [oldVChildren]
    : [];
  newVChildren = Array.isArray(newVChildren)
    ? newVChildren
    : newVChildren
    ? [newVChildren]
    : [];

  let lastPlacedIndex = 0; // 上一个不需要移动的 老 dom 节点
  let keyOldMap = {};
  let patch = [];
  oldVChildren.forEach((oldVChild, index) => {
    // oldVChild._mountIndex = index; // 记住新的 虚拟 dom index 位置
    let oldKey = oldVChild.key || index;
    keyOldMap[oldKey] = oldVChild;
  });

  // 存放将要进行的操作
  newVChildren.forEach((newVChild, index) => {
    newVChild._mountIndex = index; // 记住新的 虚拟 dom index 位置
    let newKey = newVChild.key || index;
    let oldVChild = keyOldMap[newKey];
    if (oldVChild) {
      // 找到了的话，按理应该在此判断 类型， 省略
      // 先执行更新虚拟 dom 元素， 在 React 15 里 Dom 更新 和 dom-diff 是一起进行的
      updateElement(oldVChild, newVChild);
      if (oldVChild._mountIndex < lastPlacedIndex) {
        patch.push({
          type: MOVE,
          oldVChild,
          newVChild,
          fromIndex: oldVChild._mountIndex,
          toIndex: index,
          mountIndex: index,
        });
      }
      delete keyOldMap[newKey];
      lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild._mountIndex);
    } else {
      // 没找到，就是新增
      patch.push({
        type: PLACEMENT,
        newVChild,
        mountIndex: index,
      });
    }
  });

  // Object.values(keyOldMap).forEach((oldVChild) => {
  //   patch.push({
  //     type: DELETE,
  //     oldVChild,
  //     fromIndex: oldVChild._mountIndex,
  //   });
  // });
  // 获取 要移动的 元素
  const moveChild = patch
    .filter((action) => action.type === MOVE)
    .map((action) => action.oldVChild);
  Object.values(keyOldMap)
    .concat(moveChild)
    .forEach((oldVChild) => {
      let currentDom = findDom(oldVChild);
      currentDom.parentNode.removeChild(currentDom);
    });

  patch.forEach((action) => {
    let { type, oldVChild, newVChild, fromIndex, toIndex } = action;
    let childNodes = parentDom.childNodes; // 获取真实的 子 DOM 元素
    if (type === PLACEMENT) {
      let newDom = createDom(newVChild);
      let childDOMNode = childNodes[toIndex];
      if (childDOMNode) {
        parentDom.insertBefore(newDom, childDOMNode);
      } else {
        parentDom.appendChild(newDom);
      }
    } else if (type === MOVE) {
      let oldDom = createDom(oldVChild);
      let childDOMNode = childNodes[toIndex];
      if (childDOMNode) {
        parentDom.insertBefore(oldDom, childDOMNode);
      } else {
        parentDom.appendChild(oldDom);
      }
    }
  });

  // 简单的一一对比
  // let maxChildrenLength = Math.max(oldVChildren.length, newVChildren.length);
  // for (let i = 0; i < maxChildrenLength; i++) {
  //   // 试图取出当前的节点的 下一个， 最近的弟弟真实 DOM 节点
  //   let nextVdom = oldVChildren.find(
  //     (item, index) => index > i && item && findDom(item)
  //   );
  //   compateTwoVdom(
  //     parentDom,
  //     oldVChildren[i],
  //     newVChildren[i],
  //     findDom(nextVdom)
  //   );
  // }
}

function updateClassComponent(oldVDom, newVdom) {
  let classInstance = (newVdom.classInstance = oldVDom.classInstance);
  let oldRenderVdom = (newVdom.oldRenderVdom = oldVDom.oldRenderVdom);
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVdom.props);
  }
  classInstance.updater.emitUpdate(newVdom.props);
}

function updateFunctionComponent(oldVDom, newVdom) {
  let currentDom = findDom(oldVDom);
  let parentDom = currentDom.parentNode;
  let { type, props } = newVdom;
  let newRenderVdom = type(props);
  compateTwoVdom(parentDom, oldVDom.oldRenderVdom, newRenderVdom);
  oldVDom.oldRenderVdom = newRenderVdom;
}

const ReactDom = {
  render,
};

export default ReactDom;
