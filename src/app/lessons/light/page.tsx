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

      // const directionalLight = new THREE.DirectionalLight(0x0ff0ff, 0.9);
      // directionalLight.position.set(0, 0, 1);
      // scene.add(directionalLight);

      // const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
      // scene.add(hemisphereLight);

      // const pointLight = new THREE.PointLight(0xff9000, 1.5);
      // pointLight.position.set(0, -1, 0);
      // scene.add(pointLight);

      // const pointLightSphere = new THREE.Mesh(
      //   new THREE.SphereGeometry(0.05, 32, 32),
      //   new THREE.MeshStandardMaterial({
      //     color: 0xff9000,
      //   })
      // );
      // pointLightSphere.position.copy(pointLight.position);
      // scene.add(pointLightSphere);

      // const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 1, 1);
      // rectAreaLight.position.set(-1.5, 0, 1);
      // rectAreaLight.lookAt(new THREE.Vector3());
      // scene.add(rectAreaLight);

      // const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
      // scene.add(rectAreaLightHelper);

      // const rectAreaLightMesh = new THREE.Mesh(
      //   new THREE.PlaneGeometry(
      //     rectAreaLight.width,
      //     rectAreaLight.height,
      //     1,
      //     1
      //   ),
      //   new THREE.MeshBasicMaterial({
      //     color: 0x4e00ff,
      //     side: THREE.DoubleSide,
      //   })
      // );
      // rectAreaLightMesh.position.copy(rectAreaLight.position);
      // rectAreaLightMesh.lookAt(new THREE.Vector3());
      // scene.add(rectAreaLightMesh);

      const spotLight = new THREE.SpotLight(
        0xe3cf00,
        20,
        100,
        Math.PI * 0.2,
        0.25,
        1
      );
      spotLight.position.set(0, 2, 3);
      scene.add(spotLight);

      spotLight.target.position.x = 0.75;
      scene.add(spotLight.target);

      const spotLightHelper = new THREE.SpotLightHelper(spotLight);
      scene.add(spotLightHelper);

      const material = new THREE.MeshStandardMaterial({});

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 64, 64),
        material
      );
      sphere.position.x = -1.5;

      // box
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1, 100, 100),
        material
      );

      // torus

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 64, 128),
        material
      );
      torus.position.x = 1.5;

      // plane
      const bottomPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 100, 100),
        material
      );

      bottomPlane.rotateX(-Math.PI / 2);
      bottomPlane.position.y = -2;

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
        spotLightHelper.update();

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
