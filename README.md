1. React 16 和 17 编译区别

- React 16 => React.createElement
- React 17 => import { jsx as \_jsx } from 'raect/jsx-runtime'
  原因： epoxrt let element = <h1> hello </h2>
  - 可以不需要 React, 但是 babel 转义出问题
  - 引入 React， 因为没有用到，可能会出错 如 eslint
