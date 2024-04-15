/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import notofont from "./Noto Sans KR ExtraBold_Regular.json";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";
    // Scene
    const scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();

    // instantiate a loader
    const loader = new OBJLoader();

    // load a resource

    const matcapTexture = textureLoader.load(
      new URL("./textures/matcaps/3.png", import.meta.url).href
    );

    const fontLoader = new FontLoader();

    fontLoader.load(
      new URL("./Noto Sans KR ExtraBold_Regular.json", import.meta.url).href,
      (font) => {
        const textGeometry = new TextGeometry("안녕 Three.js.", {
          font: font,
          size: 0.3,
          height: 0.2,
          curveSegments: 3,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        textGeometry.center();
        // textGeometry.computeBoundingBox();

        // textGeometry.translate(
        //   -(textGeometry.boundingBox!.max.x - 0.02) * 0.5,
        //   -(textGeometry.boundingBox!.max.y - 0.02) * 0.5,
        //   -(textGeometry.boundingBox!.max.z - 0.03) * 0.5
        // );
        // console.log(textGeometry.boundingBox);

        matcapTexture.colorSpace = THREE.SRGBColorSpace;
        const textMaterial = new THREE.MeshMatcapMaterial({
          // wireframe: true,
          matcap: matcapTexture,
        });

        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.z = 0.5;
        scene.add(text);

        const geometry = new THREE.TorusGeometry(0.5, 0.3, 20, 50);
        const material = new THREE.MeshMatcapMaterial({
          // color: Math.random() * 0xffffff,
          matcap: matcapTexture,
        });

        for (let i = 0; i < 1000; i++) {
          const torus = new THREE.Mesh(geometry, material);

          torus.position.x = (Math.random() - 0.5) * 20;
          torus.position.y = (Math.random() - 0.5) * 20;
          // torus.position.z = (Math.random() - 0.5) * 20;

          torus.rotation.x = Math.random() * Math.PI;
          torus.rotation.y = Math.random() * Math.PI;
          // torus.rotation.z = Math.random() * Math.PI;

          scene.add(torus);
        }

        // Axes helper
        // const axesHelper = new THREE.AxesHelper(2);
        // scene.add(axesHelper);
      }
    );

    // Object
    // const geometry = new THREE.BoxGeometry(1, 1, 1, 2);

    // const material = new THREE.MeshBasicMaterial();
    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.z = 3;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, el.current);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Animate
    const clock = new THREE.Clock();

    let requestId: number;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      requestId = window.requestAnimationFrame(tick);
    };

    tick();
    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;
