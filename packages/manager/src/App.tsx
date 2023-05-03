import { useState } from "react";

import { client } from "./client";

export function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const deleteAsset = async () => {
    const res = await client.deleteAsset.mutate(text);
    console.log(res);
  };
  const renameAsset = async () => {
    const res = await client.renameAsset.mutate({
      oldPath:
        "/Users/moonchop/Desktop/4-1/capstone/assetbox/example/react/public/images/0_copy.png",
      newPath:
        "/Users/moonchop/Desktop/4-1/capstone/assetbox/example/react/public/images/0_modified_copy.png",
    });
    console.log(res);
  };
  return (
    <div>
      <p>Count {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <div>
        <input onChange={(e) => setText(e.target.value)} />
        <button onClick={deleteAsset}>버튼</button>
      </div>
      <div>
        <button onClick={renameAsset}>이름 수정</button>
      </div>
    </div>
  );
}
