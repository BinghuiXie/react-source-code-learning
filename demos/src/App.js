import React from 'react';
import RefDemo from "./ref";
import FancyButton from './forwardRef'

const ref = React.createRef();

function App() {
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
    </div>
  );
}

export default App;
