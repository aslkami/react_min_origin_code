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

3. react-router 和 react-router-dom

- 原理

  - HashHistory 和 BrowserHistory 分别对应 HashRouter 和 BrowserRouter, 在对应 Router 创建对应 createHashHistory 和 createBrowserHistory，产生的 history 对象信息， 传入 Router 组件里
  - Router 组件里 保存 location 变量值，当路由变化时候，调用 listener 的事件， setState 保存最新的对象， 然后通过 Provider 将 history 和 location 传递给 children
  - Route 组件里。接收 Provider 的信息， 通过和 自身的 Props 匹配对应的 路径，渲染返回对应的 传入 组件

- createHashHistory 和 createBrowserHistory

  - 通过监听 hashChange 和 popchange 获得最新的 history 信息
  - hashHistory 无法 pushState 传递参数
  - window 没有 onpushstate 的监听事件， 可以 通过 自定义事件 customEvent 模拟

- Link 组件， 里面就是 根据 Provider 提供的 props，依附于 a 标签，组织默认事件 并调用 history api 跳转
- Switch 组件，优先返回 匹配到的结果， 然后 React.clone 这个子路由
- Route 组件，根据 props 匹配 url 路径，返回对应的 组件
- Redirect 组件，内部返回组件，在组件 didmount 的时候 跳转至 指定的 to 路径
- NavLink 组件， 原理是 传入 根据 Route children 渲染，无论有没有跳转，目的是为了知道用户的点击态
- Protected 组件， 原理用的是 renderProps, 用于自定义渲染组件
- Prompt 组件，在跳转之前询问页面是否需要离开，原理， when 参数 传入 true 的时候， 给予 message 函数参数传入，类似于 renderProps，传入 location 的参数，然后返回 函数 用于 销毁变量，类似于 listener 函数， 用完就销毁

```jsx
<Prompt
  when={true}
  message={(location) => `是否离开当前路径${location.pathname}`}
>
let msg = message
let allow = window.prompt(msg(location))
if(!allow) return // !allow 选择否 就不跳转了
```

- withRouter 组件，源码用 Provider ，可用高阶组件实现， 用于非路由组件去 调用 history Api
- useParams | useLocation | useHistory 都是 利用 Provider 获取 路由信息
- useRouteMatch 调用 match 返回 对象
