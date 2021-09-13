import { REACT_TEXT } from "./constants";

// 方便 dom-diff 唯一和源码不一样的地方
export function wrapToVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? { type: REACT_TEXT, props: { content: element } }
    : element;
}
