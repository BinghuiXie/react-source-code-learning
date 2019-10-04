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
这次呢，<kbd>createElement</kbd>函数接受了四个参数，前面两个参数好理解就是标签名称和其属性，而第三个和第四个参数都是这个标签的子元素，也就是说，<kbd>createElement</kbd>函数会把第三个参数（包括第三个）以后的参数都认为是该标签的同级的子元素，它会把这个剩余的参数提取出来作为一个子元素的数组。
