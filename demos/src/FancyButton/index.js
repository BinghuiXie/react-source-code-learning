import React from 'react';

const AnotherFancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

export default AnotherFancyButton