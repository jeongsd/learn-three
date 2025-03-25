"use client";

import "./style.css";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";


function Page() {
  return (
    <div style={{ width: "100%", height: "100%" }}>

      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [- 4, 3, 6]
        }}
      >

        <Experience />
      </Canvas>
    </div>
  );
}

export default Page;
