React 源码学习记录
=========================
### 准备
<kbd>react</kbd> 的代码是我直接从 <kbd>github</kbd> 上 <kbd>clone</kbd>下来的，项目地址：[Facebook React源码仓库](https://github.com/facebook/react.git)。   

### JSX 转 JavaScript
学习 JSX 转 JavaScript 过程中用到了 <kbd>babel</kbd> 官方提供的 [Playground](https://babeljs.io/repl)   
先来一个简单的ES6的代码，看看转换后是什么样子的：
```javascript
// 示例代码 01：
const ToolBar = props => {
  console.log("ToolBar");
}

// 转换后
var ToolBar = function ToolBar(props) {
  console.log("ToolBar");
};
```
<kbd>babel</kbd> 将ES6的箭头函数转换成了普通的JavaScript函数，并使用 <kbd>var</kbd> 定义   

接下来写一个简单的标签，并加一些属性
```html
<!-- 示例代码 02 -->
<div class="div" id="root">test</div>
```
```javascript
<!-- 转换后的代码 -->
React.createElement(
  "div", 
  { class: "div", id: "root" },
   "test"
);
```
可以看出，<kbd>createElement</kbd>函数接收是三个参数，第一个参数是标签的名字，第二个参数是标签的属性，第三个参数是标签内部的子元素。   
接下来写一个稍微复杂一点的例子：
```html
<!-- 示例代码 03 -->
<div class="div" id="root">
    test
    <span class="children">child</span>
</div>
```
```javascript
// 转换后的代码
React.createElement(
    "div", 
    { class: "div", id: "root" }, 
    "test", 
    React.createElement("span", { class: "children" }, "child")
);
```
这次呢，<kbd>createElement</kbd>函数接受了四个参数，前面两个参数好理解就是标签名称和其属性，而第三个和第四个参数都是这个标签的子元素，也就是说，<kbd>createElement</kbd>函数会把第三个参数（包括第三个）以后的参数都认为是该标签的同级的子元素，它会把这些剩余的参数提取出来，并组成一个子元素的数组。   
那么，如果是一个组件作为标签呢？
```typescript jsx
function Tool(props) {
  return ( <div>{props.children}</div> )
}

<Tool className="Tool">
    <span className="tool-children">Tool Children</span>
</Tool>
```
```javascript
// 转换后的代码
function Tool(props) {
  return React.createElement("div", null, props.children);
}

React.createElement(
  Tool, 
  { className: "Tool" }, 
  React.createElement("span", { className: "tool-children" }, "Tool Children")
);
```
注意到，当使用组件作为标签的时候，<kbd>createElement</kbd>函数第一个参数不再是一个字符串了，而是一个变量，这就是为什么我们自定义的组件的名字要大写的原因，如果不大写的话，<kbd>createElement</kbd>会将其当做一个 html 的预定义标签从而将其作为字符串进行处理，反之如果大写了就是会当做变量处理了。

那么<kbd>createElement</kbd>函数会根据所传入的 type (第一个参数) 返回一个React Element？

### ReactElement
所以函数<kbd>createElement</kbd>最终是返回了一个 ReactElement，在这个过程中<kbd>createElement</kbd>函数对传入的参数进行了一系列的处理以后，最终返回了一个 ReactElement 对象。
<kbd>createElement</kbd>函数源码地址：**packages/react/src/ReactElement.js**

那么这个函数具体对传入的参数进行了哪些处理，这些就要从代码中得到答案了(我这里只截取了部分代码)。

```javascript
    const RESERVED_PROPS = {
      key: true,
      ref: true,
      __self: true,
      __source: true,
    };
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    function createElement(type, config, children) {  
      let propName;
      const props = {};
    
      let key = null;
      let ref = null;
      let self = null;
      let source = null;
    
      if (config != null) {
        if (hasValidRef(config)) {
          // 如果配置项（传入的标签的属性）里有 ref 的话，进行如下操作
          ref = config.ref;
        }
        if (hasValidKey(config)) {
          // 如果配置项有 key 值的话（一般来说是循环项），进行如下操作
          key = '' + config.key;
        }
    
        for (propName in config) {
          // 判断传入的 config 里面有没有对应的属性，同时该属性不能是 RESERVED_PROPS 中的属性
          // 如果满足以上两个条件就将其放到 props 对象里面
          // hasOwnProperty 是对 Object.prototype.hasOwnProperty 的一个引用。
          // hasOwnProperty.call(object, key) 这样写法优于 object.hasOwnProperty(key)
          if (
            hasOwnProperty.call(config, propName) &&
            !RESERVED_PROPS.hasOwnProperty(propName)
          ) {
            props[propName] = config[propName];
          }
        }
      }
      // 获取剩余的参数（剩余的都是该标签对应的子元素的项）
      const childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        // 把子元素组成一个数组返回
        const childArray = Array(childrenLength);
        for (let i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
      }
      // 判断一下有没有 defaultProps，如果有的话寻找一下 props 对象里面对应的属性有没有值，如果没有就用 defaultProps 里面的值来代替
      if (type && type.defaultProps) {
        const defaultProps = type.defaultProps;
        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
      }
      return ReactElement(
        type,
        key,
        ref,
        self,
        source,
        ReactCurrentOwner.current,
        props,
      );
}
```
最后返回的 <kbd>ReactElement</kbd> 函数就是一个集合，返回一个对象，这个对象的属性是经过 <kbd>createElement</kbd> 处理的 ，相关代码如下(只拿了部分代码)：
```javascript
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    // REACT_ELEMENT_TYPE 就是一个 symbol
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };

  return element;
};
```

### ReactComponent ReactPureComponent

源码地址：react/packages/react/src/ReactBaseClasses.js

ReactComponent 是写React过程中最常用的一个Class了，一般来说都是直接 extends Component ... 这节就深入到 Component 的源码来对其进行详细的分析

### React createRef & ref

React 开发过程中，操作 DOM 的情况是比较少的，毕竟他不需要通过选取节点来改变其内容，只需要改变绑定在这个节点上的数据就可以，但是在某些情况下，操作 DOM 也是不得不需要的，比如说操作动画，那么在 React 中获取 DOM 节点就需要用到 ref   
ref有三种用法
+ stringRef
    通过挂载在 <kbd>this</kbd> 上的 refs 对象中的 stringRef 得到对应的节点
    ```javascript
        class RefDemo1 extends React.Component {
          render() {
            return <p type="text" ref="stringRef" >stringRef</p>;
          }
        
          componentDidMount() {
            this.refs.stringRef.textContent = "stringRef text changed";
          }
        }
    ```
+ function
    这里 element 代表的就是 DOM 节点，把它赋值给了 this.ref
    ```javascript
        class RefDemo2 extends React.Component {
          render() {
            return <p type="text" ref={element => { this.ref = element }>function ref</p>;
          }
          componentDidMount() {
            this.ref.textContent = "function ref text changed";
          }
        }
    ```
+ createRef
    这个是三种使用 ref 中唯一涉及到使用了 react 的中的一个 API 的， createRef 返回一个对象，对象中只有一个 current 属性，默认值是 null
    ```javascript
        class RefDemo3 extends React.Component {
          constructor(props) {
            super(props);
        
            this.inputRef = React.createRef();
          }
        
          render() {
            return <input type="text" ref={this.inputRef} />;
          }
        
          componentDidMount() {
            // 通过 current 属性来引用
            this.inputRef.current.focus();
          }
        }
    ```
    
### forwardRef

[React forwardRef官方解释](https://reactjs.org/docs/forwarding-refs.html)

forwardRef 不是很常用，但是在某些特定的情况下，使用 forwardRef 会方便许多。
forwardRef 是一种动态的将 ref 通过一个组件传给其子组件的一种技术，它在大部分的情况下是用不到的，然而，在一些特定的情况下，会非常有用。
假设有一个 FancyButton 组件封装了一个 button：
```javascript
function FancyButton(props) {
  return (
    <button className="FancyButton">
      {props.children}
    </button>
  );
}
```
然后在另一个组件里将其作为子组件使用：
```javascript
import FancyButton from './fancyButton';

function Comp() {
  return (
    <div>
        <FancyButton/>
    </div>
  )
}
```
这些组件(FancyButton)的使用方式与常规的DOM按钮和输入类似，为了管理焦点、选择或动画，访问它们的DOM节点可能是不可避免的。
然而，因为 ref 不会被认为是 props 里面的一个属性(从前面的源码学习中我们已经清楚了这一点)，所以通过 ref 在 FancyButton 上设置显然是不可能传到里面的 button 上的，所以就需要使用 forwardRef：   
```javascript
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>
```
通过 React 提供的 forwardRef API，回调函数接收的第一个参数还是 props，第二个参数是 ref (只有使用了 forwardRef 才会有第二个参数)。
这样，通过 ref 再传到 button 上就可以像使用正常的 button 一样使用这个组件了。

