import React from 'react';
import ThemedButton from "./components/themed-button";

class ToolBar extends React.Component {
  render() {
    return (
      <div>
        <ThemedButton onClick={ this.props.changeTheme }/>
      </div>
    );
  }
}
export default ToolBar