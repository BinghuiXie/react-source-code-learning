import React from 'react';

export default class TextBlock extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render () {
    return (
      <blockquote>
        { this.props.text }
      </blockquote>
    )
  }
}