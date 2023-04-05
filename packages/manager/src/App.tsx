import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
