import React from 'react'
import logProps from "../logPropsHOC";

class FancyButton extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    const { label, handleClick, value } = this.props;
    return (
      <button
        label={label}
        onClick={handleClick}
        value={value}
      >
        {this.props.children}
      </button>
    )
  }
}

export default logProps(FancyButton);