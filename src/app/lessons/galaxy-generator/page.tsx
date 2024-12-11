/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";
    // Scene
    const scene = new THREE.Scene();

    const parameters = {
      count: 10000,
      size: 0.02,
      radius: 5,
      branches: 5,
      rotationDegree: 0.52,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: "#ff6030",
      outsideColor: "#1b3984",
    };

    const gui = new GUI({
      width: 300,
      title: "Awesome debug UI",
      closeFolders: true,
    });

    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.PointsMaterial | null = null;
    let points: THREE.Points | null = null;

    const generateBranch = (patternList: number[]) => {
      if (points && geometry && material) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
      }
      geometry = new THREE.BufferGeometry();

      const positionsArray = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);
      for (let i = 0; i < parameters.count; i++) {
        const index = i * 3;

        const radius = Math.random() * parameters.radius;
        let theta = Math.random() * Math.PI * 2;

        const remainder = theta % ((Math.PI / parameters.branches) * 2);

        theta = theta - remainder + Math.PI / parameters.branches;
        theta = theta + Math.pow(10 / radius, parameters.rotationDegree);

        const randomX =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;
        const randomY =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;
        const randomZ =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;

        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);

        positionsArray[index] = x + randomX;
        positionsArray[index + 1] = randomY;
        positionsArray[index + 2] = y + randomZ;

        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[index] = mixedColor.r;
        colors[index + 1] = mixedColor.g;
        colors[index + 2] = mixedColor.b;
      }
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positionsArray, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      if (material) {
        material.dispose();
      }

      const particleTexture = new THREE.TextureLoader().load(
        new URL("../particle/textures/particles/1.png", import.meta.url).href
      );
      material = new THREE.PointsMaterial({
        map: particleTexture,
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    const generateGalaxy = () => {};

    gui
      .add(parameters, "count")
      .min(100)
      .max(1000000)
      .step(100)
      .name("count")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "size")
      .min(0.001)
      .max(0.1)
      .step(0.001)
      .name("size")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "radius")
      .min(0.1)
      .max(20)
      .step(0.1)
      .name("radius")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "branches")
      .min(1)
      .max(20)
      .step(1)
      .name("branches")
      .onFinishChange(generateGalaxy);

    gui
      .add(parameters, "randomness")
      .min(0)
      .max(2)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "randomnessPower")
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(generateGalaxy);

    gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
    gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);
    generateGalaxy();

    /**
     * Sizes
     */
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
    const controls = new OrbitControls(camera, el.current);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let requestId = 0;

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
