title: Redux 学习笔记
tags: [Redux, React, JavaScript]
---

## 零、环境搭建
* [英文原版文档](http://redux.js.org/)
* [中文文档](http://cn.redux.js.org/)

首先要明确一点，虽然 redux 是由 [flux](http://facebook.github.io/flux/) 演变而来，但我们完全可以并且也应该抛开 react 进行学习，这样可以避免一开始就陷入各种细节之中。

所以推荐使用 [jsfiddle](https://jsfiddle.net/) 进行调试学习，或者使用 [react-create-app](https://github.com/facebookincubator/create-react-app) 用于和 react 配合使用。

## 一、Redux 是什么？
> Redux is a predictable state container for JavaScript apps.  
> Redux 是一个 JavaScript 状态容器，提供可预测化的状态管理。

![overview](/blog/imgs/redux/overview.png)

上个图先...先不要在意那些细节

* 总的来说，redux 保存并管理页面中的各种状态（state）
* 当需要改变 state 时，在 action creators 中用 dispatch 触发定义好的 action
* 接着使用纯函数（pure function）reducer 来处理这些 action，它会根据当前 state 和 action 返回（注意这里不是修改）新的 state
* view 层可以对于 state 进行订阅（subscribe），这样就可以得到新的 state，从而可以刷新界面（所以十分适合数据驱动的前端框架）

> pure function：简单的说就是对于同样的输入总是返回同样的输出，并且没有副作用的函数。

### 1.1. 为什么选择 redux？
> 随着 JavaScript 单页应用开发日趋复杂，JavaScript 需要管理比任何时候都要多的 state （状态）。 这些 state 可能包括服务器响应、缓存数据、本地生成尚未持久化到服务器的数据，也包括 UI 状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等。

> 管理不断变化的 state 非常困难。如果一个 model 的变化会引起另一个 model 变化，那么当 view 变化时，就可能引起对应 model 以及另一个 model 的变化，依次地，可能会引起另一个 view 的变化。直至你搞不清楚到底发生了什么。state 在什么时候，由于什么原因，如何变化已然不受控制。 当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰。

> 如果这还不够糟糕，考虑一些来自前端开发领域的新需求，如更新调优、服务端渲染、路由跳转前请求数据等等。前端开发者正在经受前所未有的复杂性，难道就这么放弃了吗？当然不是。

> 这里的复杂性很大程度上来自于：我们总是将两个难以厘清的概念混淆在一起：变化和异步。 我称它们为曼妥思和可乐。如果把二者分开，能做的很好，但混到一起，就变得一团糟。一些库如 React 试图在视图层禁止异步和直接操作 DOM 来解决这个问题。美中不足的是，React 依旧把处理 state 中数据的问题留给了你。Redux就是为了帮你解决这个问题。

> 跟随 Flux、CQRS 和 Event Sourcing 的脚步，通过限制更新发生的时间和方式，Redux 试图让 state 的变化变得可预测。这些限制条件反映在 Redux 的 三大原则中。

**使用 Redux 我们可以**
* 拥有可预测（predictable）的应用状态，所以应用的行为也是可预测的
* reducer 是纯函数，方便对于状态迁移进行自动化测试
* 方便地记录日志，甚至实现时间旅行（time travel）

### 1.2. 三大原则
#### 1.2.1. 单一数据源（Single source of truth）
整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。

* 来自服务端的 state 可以在无需编写更多代码的情况下被序列化并注入到客户端中
* 便于调试，在开发时可以将状态保存在本地
* Undo/Redo 可以轻松实现，从而实现时间旅行

#### 1.2.2. State 是只读的（State is read-only）
惟一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

因为所有的修改都被集中化处理，且严格按照一个接一个的顺序执行，（dispatch 同步调用 reduce 函数）因此不用担心 race condition 的出现。 Action 就是普通对象而已，因此它们可以被日志打印、序列化、储存、后期调试或测试时回放出来。

#### 1.2.3. 使用纯函数来执行修改（Changes are made with pure functions）
为了描述 action 如何改变 state tree ，你需要编写 reducers。

Reducer 只是一些纯函数，它接收先前的 state 和 action，并返回新的 state。刚开始你可以只有一个 reducer，随着应用变大，你可以把它拆成多个小的 reducers，分别独立地操作 state tree 的不同部分。

## 二、Redux 基础
### 2.1. action
Action 就是一个普通的 JavaScript Object。

redux 唯一限制的一点是必须有一个 type 属性用来表示执行哪种操作，值最好用字符串，而不是 Symbols，因为字符串是可被序列化的。

其他属性用来传递此次操作所需传递的数据，redux 对此不作限制，但是在设计时可以参照 [Flux 标准 Action](https://github.com/acdlite/flux-standard-action)。

> 简单总结 Flux Standard action 就是  
> 一个 action 必须是一个 JavaScript Object，并且有一个 type 属性。  
> 一个 action 可以有 payload/error/meta 属性。  
> 一个 action 不能有其他属性。  

### 2.2. reducer
Reducer 的工作就是接收旧的 state 和 action，返回新的 state。

> (previousState, action) => newState

之所以称作 reducer 是因为它将被传递给 `Array.prototype.reduce(reducer, ?initialValue)` 方法。保持 reducer 纯净非常重要。永远不要在 reducer 里做这些操作：

* 修改传入参数；
* 执行有副作用的操作，如 API 请求和路由跳转；
* 调用非纯函数，如 Date.now() 或 Math.random()。

### 2.3. store
Store 就是用来维持应用所有的 state 树 的一个对象。

在 redux 中只有一个 store（区别于 flux），在 store 中保存所有的 state。可以先把它当成一个 Object，但是除了对其 dispatch 一个 action 以外无法改变内部的 state。

在实际操作中我们只需要把根部的 reducer 函数传递给 createStore 就可以得到一个 store。

```javascript
import { createStore } from 'redux';

function reducer(state, action) {
    switch (action.type) {
        case 'SOME_ACTION':
            // 一些操作
            return newState; // 返回新状态
        default:
            return state;
    }
}

const store = createStore(reducer);
```

**redux 中提供了这几个 api 操作 store**
#### 2.3.1. getState
返回当前的整个 state 树。

#### 2.3.2. dispatch(action)
分发 action 给对应的 reducer。

该函数会调用 getState() 和传入的 action 以【同步】的方式调用 store 的 reduce 函数，然后返回新的 state。从而 state 得到了更新，并且变化监听器（change listener）会被触发。（对于异步操作则将其放到了创建 action 这个步骤）

#### 2.3.3. subscribe(listener)
为 store 添加一个变化监听器，每当 dispatch 的时候就会执行，你可以在 listener（回调函数）中使用 getState() 来得到当前的 state。

这个 api 设计的挺有意思，它会返回一个函数，而你执行这个函数后就可以取消订阅。

#### 2.3.4. replaceReducer(nextReducer)
替换 store 当前用来计算 state 的 reducer。

这是一个高级 API。只有在你需要实现代码分隔，而且需要立即加载一些 reducer 的时候才可能会用到它。在实现 Redux 热加载机制的时候也可能会用到。

### 2.4. createStore
忽略各种类型判断，实现一个最简的 createStore 可以用以下代码。[参考资料](https://egghead.io/lessons/javascript-redux-implementing-store-from-scratch)

```javascript
const createStore = (reducer) => {
    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action); // 调用 reducer
        listeners.forEach(listener => listener()); // 调用变化监听器
    };

    const subscribe = (listener) => {
        listeners.push(listener);

        return () => {
            // 返回解除监听函数
            listeners = listeners.filter(l => l !== listener);
        };
    }

    dispatch({}); // 初始化

    return { getState, dispatch, subscribe };
};

```

### 2.5. 计数器例子
{% jsfiddle 6fssgop5 %}

## 三、与 React 进行结合
### 3.1. 通过 script 标签导入 react
实现同样功能的 Counter

{% jsfiddle f0snhqmr %}

### 3.2. 用 Redux 和 React 实现 TodoApp
在添加 react-redux 之前，首先来实现一个比计数器更复杂一点儿的 TodoApp 栗子~为了体会下 react-redux 的作用~

#### 3.2.1. 分析与设计
##### 1. 容器组件 V.S. 展示组件

组件一般分为：容器组件（Smart/Container Components）和展示组件（Dumb/Presentational Components）

 | 容器组件 | 展示组件
--- | ---
Location | 最顶层，路由处理 | 中间和子组件
Aware of Redux | 是 | 否
读取数据 | 从 Redux 获取 state | 从 props 获取数据
修改数据 | 向 Redux 派发 actions | 从 props 调用回调函数

最佳实践一般是只在最顶层组件（如路由操作）里使用 Redux。其余内部组件仅仅是展示性的，所有数据都通过 props 传入。

在 TodoApp 中，应该只有一个位于最高层的容器组件，（在复杂应用中可能有多个容器组件），虽然也可以嵌套使用容器组件，但还是应该尽可能地传递 props。

##### 2. 应用设计
* 一个 TodoApp 包含了三个部分：
    * 顶部的 AddTodo 输入部分
    * 中间的 TodoList 展示部分
    * 底部的 Footer 过滤部分

* State 应该包含：
    * filter：过滤 todos 的条件
        * SHOW_ALL
        * SHOW_ACTIVE
        * SHOW_COMPLETED
    * todos：所有的 todo
        * todo：包含 id、text 和 completed

* 然而应用的 props 只需要：
    * visibalTodos：过滤后的 todos
    * filter：过滤条件

* Action 应该有：
    * ADD_TODO
    * TOGGLE_TODO
    * SET_VISIBILITY_FILTER

#### 3.2.2. 编码实现
* action 部分

```javascript
// 暂且使用数字作为 id
let nextTodoId = 0;

// action 创建函数
const addTodo = (text) => (
    { type: 'ADD_TODO', id: nextTodoId++, text }
);

const toggleTodo = (id) => (
    { type: 'TOGGLE_TODO', id }
);

const setVisibilityFilter = (filter) => (
    { type: 'SET_VISIBILITY_FILTER', filter }
);
```

* reducer 部分

```javascript
// 默认初始状态
const initialState = {
    filter: 'SHOW_ALL',
    todos: [],
};

function todoReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TODO':
            // 解构
            const { id, text } = action;

            return {
                ...state,
                todos: {
                    ...state.todos,
                    { id, text, completed: false },
                },
            };

        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo => {
                    if (todo.id !== action.id) return todo;

                    return {
                        ...todo,
                        completed: !todo.completed,
                    };
                }),
            };

        case 'SET_VISIBILITY_FILTER':
            return {
                ...state,
                filter: action.filter,
            };


        default:
            return state;
    }
}
```

> 注意：  
> 1. 不要直接修改原有的 state，而是返回一个新的 state。可以使用 Object.assign() 新建一个新的 state。不能这样使用 Object.assign(state, { visibilityFilter: action.filter })，因为它会改变第一个参数的值。你必须把第一个参数设置为空对象。你也可以开启对 ES7 提案对象展开运算符的支持, 从而使用 { ...state, ...newState } 达到相同的目的。  
> 2. 在 default 的情况下返回旧的 state，用来兼容遇到未知的 action 这样的错误。

**拆分 reducer**
目前代码看着比较冗长，其实在逻辑上 todos 的处理和 filter 的处理应该分开，所以在 state 没有互相耦合时，可以将其拆分，从而精细地对于 state 的子树进行处理。

```javascript
// 处理单个 todo
const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false,
            };

        case 'TOGGLE_TODO':
            if (state.id !== action.id) return state;

            return {
                ...state,
                completed: !state.completed,
            };

        default:
            return state;
    }
};

// 处理 todos
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action),
            ];

        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));

        default:
            return state;
    };
};

// 处理 filter
const filter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;

        default:
            return state;
    };
};

function todoReducer(state = initialState, action) {
    return {
        todos: todos(state.todos, action),
        filter: filter(state.filter, action),
    };
}
```

观察最后的 todoReducer 函数，

随着应用的膨胀，我们还可以将拆分后的 reducer 放到不同的文件中, 以保持其独立性并用于专门处理不同的数据域。
















{% jsfiddle q4s3xL7v %}






















##
