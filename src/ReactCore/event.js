import { updateQuene } from "./Component";

/**
 *
 * @param {*} dom 绑定的 dom 元素
 * @param {*} eventType 事件类型
 * @param {*} eventHandler 事件处理函数
 */
export function addEvent(dom, eventType, eventHandler) {
  let store;
  if (dom._store) {
    store = dom._store;
  } else {
    dom._store = {};
    store = dom._store;
  }
  store[eventType] = eventHandler;

  if (!document[eventType]) {
    document[eventType] = dispatchEvent;
  }
}

// 不管点什么 按钮， 触发什么事件， 最终执行的 都是 dispatchEvent
// 原生的事件对象， 不同浏览器 事件对象可能不一样
// 在合成事件的处理函数里， 状态的更新是 批量的
function dispatchEvent(event) {
  debugger;
  let { target, type } = event; // 例如 target => button, type => click
  let eventType = "on" + type;

  updateQuene.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);
  // 模拟冒泡的过程
  let currentTarget = target;
  while (currentTarget) {
    let { _store } = currentTarget;
    let eventHandler = _store && _store[eventType];
    if (eventHandler) {
      syntheticEvent.target = target;
      syntheticEvent.currentTarget = currentTarget;
      eventHandler.call(target, syntheticEvent);
    }
    currentTarget = currentTarget.parentNode;
  }

  updateQuene.isBatchingUpdate = false;
  updateQuene.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (let key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key];
  }
  // 此处源码有 一些兼容性处理， 如 组织冒泡 默认事件等
  return syntheticEvent;
}
