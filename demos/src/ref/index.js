import React from 'react';

export default class RefDemo extends React.Component{
  constructor() {
    super();
    
    this.refObj = React.createRef();
  }
  
  componentDidMount () {
    console.log(this.refObj);
    setTimeout(() => {
      this.refObj.current.textContent = "ref3 changed";
      this.refs.stringRef.textContent = "ref1 changed";
      this.ref.textContent = "ref2 changed text";
    }, 2000)
  }
  
  render () {
    return (
      <div>
        <p className="ref1" ref="stringRef">ref1</p>
        <p ref={ele => { this.ref = ele }}>ref2</p>
        <p ref={this.refObj}>ref3</p>
      </div>
    )
  }
}