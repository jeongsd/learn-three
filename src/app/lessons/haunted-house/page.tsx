/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import { render } from "./render";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";

    const clear = render(el.current);

    return () => {
      clear();
    };
  });

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;
