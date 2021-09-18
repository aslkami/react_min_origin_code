import { wrapToVdom } from "./utils";
import Component from "./Component";
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
  return { type, ref, key, props };
}

const React = {
  createElement,
  Component,
};

export default React;
