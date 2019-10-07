import React from "react";
import { ThemeContext } from '../../theme-context'

class ThemedButton extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props);
    console.log(this.context);
    const props = this.props;
    const theme = this.context;
    return (
      <button
        {...props}
        style={{ backgroundColor: theme.foreground, color: theme.background }}
      >
        Context Demo
      </button>
    );
  }
}

ThemedButton.contextType = ThemeContext;

export default ThemedButton