import React from 'react';
import RefDemo from "./ref";
import FancyButton from './forwardRef'
import AnotherFancyButton from "./FancyButton";
import BlogPost from "./BlogPost";
import CommentList from "./CommentList";
import ToolBar from "./ContextDemo";
import { ThemeContext, themes } from "./theme-context";


const ref = React.createRef();
const anotherRef = React.createRef();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.light
    }
  }
  toggleTheme = () => {
    this.setState(state => (
      { theme: state.theme === themes.dark ? themes.light : themes.dark }
    ))
  };
  
  render () {
    return (
      <div className="App">
        <RefDemo />
        <FancyButton
          label="Click me"
          value="FancyButton"
          handleClick={() => {
            console.log("Button Clicked");
          }}
          ref={ref}
        >
          FancyButton
        </FancyButton>
        <AnotherFancyButton
          ref={ anotherRef }
        >
          AnotherFancyButton
        </AnotherFancyButton>
        <BlogPost />
        <CommentList />
        <ThemeContext.Provider value={ this.state.theme }>
          <ToolBar changeTheme={ this.toggleTheme }/>
        </ThemeContext.Provider>
      </div>
    );
  }
}

export { ThemeContext }
export default App;
