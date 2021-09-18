1. React 16 和 17 编译区别

- React 16 => React.createElement
- React 17 => import { jsx as \_jsx } from 'raect/jsx-runtime'
  原因： epoxrt let element = <h1> hello </h2>
  - 可以不需要 React, 但是 babel 转义出问题
  - 引入 React， 因为没有用到，可能会出错 如 eslint

2. 合成事件

- 通过事件委托实现， 由 button 的事件 绑定到 document 上
- 可以做一些 浏览器兼容性处理， 不同 浏览器 API 不一样， 把不同的事件对象做成 一个 标准化的事件对象，提供标准 API 访问供用户使用
- React 17 前是 在 document 上，17 之后是在 根节点上
