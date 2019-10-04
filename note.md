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
