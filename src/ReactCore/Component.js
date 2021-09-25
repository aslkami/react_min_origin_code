import { createDom, findDom, compateTwoVdom } from "./react-dom";

export let updateQuene = {
  isBatchingUpdate: false, // 默认 非批量 同步的
  updaters: [], // Updater 数组
  batchUpdate() {
    for (let updater of updateQuene.updaters) {
      updater.updateComponent();
    }
    updateQuene.updaters.length = 0;
    updateQuene.updaters.isBatchingUpdate = false;
  },
};

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = []; // 等待生效的数组
    // this.callbacks = [];
  }

  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate(); // 触发更新
  }

  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    if (updateQuene.isBatchingUpdate) {
      // 批量异步更新
      updateQuene.updaters.push(this);
    } else {
      // 同步更新
      this.updateComponent();
    }
  }

  updateComponent() {
    const { classInstance, pendingStates, nextProps } = this;
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState());
    }
  }

  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach((particialState) => {
      if (typeof particialState === "function") {
        particialState = particialState(state);
      }
      state = { ...state, ...particialState };
    });
    pendingStates.length = 0;
    return state;
  }
}

function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true; // 组件是否需要更新
  const { shouldComponentUpdate, componentWillUpdate } = classInstance;

  if (shouldComponentUpdate && !shouldComponentUpdate(nextProps, nextState)) {
    willUpdate = false;
  }

  if (willUpdate && componentWillUpdate) {
    componentWillUpdate();
  }

  if (nextProps) {
    classInstance.props = nextProps;
  }

  classInstance.state = nextState;

  willUpdate && classInstance.forceUpdate();
}

// 子类继承父类的时候， 父类的静态属性 也是可以继承的
class Component {
  static isReactComponent = true; // 源码是 Component.prototype.isReactComponent = {}
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }

  setState(partialState) {
    this.updater.addState(partialState);
  }

  // 根据新属性状态，计算新的要渲染的 虚拟 dom
  forceUpdate() {
    let oldRenderVdom = this.oldRenderVdom;
    let oldDom = findDom(oldRenderVdom); // 获取 oldRenderVdom 对应的 真实 dom
    let newRenderVDom = this.render(); // 生成新的虚拟 dom
    compateTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVDom);
    this.oldRenderVdom = newRenderVDom; // 记录新的 虚拟dom
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state);
    }
  }
}

export default Component;
