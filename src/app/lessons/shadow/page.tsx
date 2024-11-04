/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/Addons.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";

      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      const gui = new GUI();

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);
      gui.add(ambientLight, "intensity").min(0).max(3).step(0.01);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
      directionalLight.position.set(0, 3, 1);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 4096;
      directionalLight.shadow.mapSize.height = 4096;

      scene.add(directionalLight);

      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
      });

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 64, 64),
        material
      );
      sphere.castShadow = true;

      sphere.position.x = -1.5;

      // box
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1, 100, 100),
        material
      );
      box.castShadow = true;

      // torus

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 64, 128),
        material
      );
      torus.castShadow = true;
      torus.position.x = 1.5;

      // plane
      const bottomPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 100, 100),
        material
      );

      bottomPlane.rotateX(-Math.PI / 2);
      bottomPlane.position.y = -1;
      bottomPlane.receiveShadow = true;

      scene.add(sphere, box, torus, bottomPlane);

      /**
       * Sizes
       */
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100
      );
      camera.position.x = 1;
      camera.position.y = 1;
      camera.position.z = 2;
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;

      /**
       * Animate
       */
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        sphere.rotation.y = elapsedTime * (Math.PI * 0.2);
        box.rotation.y = elapsedTime * (Math.PI * 0.2);
        torus.rotation.y = elapsedTime * (Math.PI * 0.2);

        sphere.rotation.x = elapsedTime * (Math.PI * 0.1);
        box.rotation.x = elapsedTime * (Math.PI * 0.1);
        torus.rotation.x = elapsedTime * (Math.PI * 0.1);

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();
    }
    main();

    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;
