// packages/frontend/src/MyApp.jsx

import React, { useState } from "react";

function MyApp() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Welcome to Gardening website!</h1>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <br></br>
      <img src="/plants/strawberry.png" alt="Strawberry"/>
    </div>
  );
}

export default MyApp;