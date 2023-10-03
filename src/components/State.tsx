import { useState } from "react";

export function State() {
  const [count, setCount] = useState(0);

  function onClick() {
    setCount(count + 1);
  }

  return <button onClick={onClick}>Count is: {count}</button>;
}
