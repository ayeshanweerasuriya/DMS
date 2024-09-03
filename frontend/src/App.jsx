import { useState } from "react";

function App() {
  const [placeholder, setPlaceholder] = useState("null");
  return (
    <>
      <h1>Entry: {placeholder}</h1>
      <button onClick={() => setPlaceholder((currentState) => !currentState)}>
        Submit
      </button>
    </>
  );
}

export default App;
