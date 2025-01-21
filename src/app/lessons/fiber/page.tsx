"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import styles from "../../page.module.css";
import "./style.css";
// import HomeButton from "@/app/components/HomeButton";
// import PageTitle from "@/app/components/PageTitle";
import { Canvas } from "@react-three/fiber";
import Render from "./Render";

function Page() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* <HomeButton />
      <PageTitle title="first-three-fiber" /> */}
      <Canvas
        // flat

        dpr={0.2}
        gl={{
          // powerPreference: "high-performance",
          antialias: false,
          toneMapping: THREE.ACESFilmicToneMapping
          // pixelRatio: 0.003
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [3, 2, 6]
        }}>
        <Render />
      </Canvas>
    </div>
  );
}

export default Page;
