import type { AppRouter } from "@assetbox/trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
// import { client } from "./client";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:5173/trpc",
    }),
  ],
});
export function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const postInput = async () => {
    const res = await client.deleteAsset.mutate(text);
    console.log(res);
  };
  return (
    <div>
      <p>Count {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <div>
        <input onChange={(e) => setText(e.target.value)} />
        <button onClick={postInput}>버튼</button>
      </div>
    </div>
  );
}
