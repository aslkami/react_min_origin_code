import { wrapToVdom } from "./utils";
import Component from "./Component";
import {
  REACT_FORWARD_REF,
  REACT_ELEMENT,
  REACT_FRAGMENT,
  REACT_CONTEXT,
  REACT_PROVIDER,
} from "./constants";
/**
 *
 * @param {*} type 元素的 类型 span div p
 * @param {*} config 配置对象 className style
 * @param {*} children  React 节点， 对象字符串数字 null都有可能
 * @returns
 */
function createElement(type, config, children) {
  let ref;
  let key;
  if (config) {
    delete config.__source; // babel 会生成这个
    delete config.__self;
    ref = config.ref;
    key = config.key;
    delete config.ref;
    delete config.key;
  }

  let props = { ...config };

  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    props.children = wrapToVdom(children);
  }
  return { $$typeof: REACT_ELEMENT, type, ref, key, props };
}

function createRef() {
  return { current: null };
}

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render,
  };
}

function createContext() {
  let context = {
    $$typeof: REACT_CONTEXT,
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context,
  };

  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context,
  };

  return context;
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  Fragment: REACT_FRAGMENT,
  createContext,
};

export default React;
