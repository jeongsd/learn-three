/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import './globals.css'
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
      count: 100000,
      size: 0.02,
      radius: 5,
      branches: 5,
      rotationDegree: 0.52,
      randomness: 1.7,
      randomnessPower: 6.6,
      insideColor: "#c45e62",
      outsideColor: "#f9271f",
      closed: false,
      curveType: "catmullrom",
      tension: 0.7,
    };

    const gui = new GUI({
      width: 300,
      title: "Awesome debug UI",
      closeFolders: true,
    });
    gui.close();

    const branches: Record<
      string,
      {
        geometry: THREE.BufferGeometry;
        material: THREE.PointsMaterial;
        points: THREE.Points;
      }
    > = {};

    function generateStars(options: {
      name: string;
      group: THREE.Group;
      count: number;
      innerColor: string;
      outsideColor: string;
      size: number;
      texture: string;
      randomLength: number;
    }) {
      const {
        name,
        group,
        count,
        innerColor,
        outsideColor,
        size,
        texture,
        randomLength,
      } = options;
      const branch = branches[name];

      let geometry: THREE.BufferGeometry | null = branch?.geometry ?? null;
      let material: THREE.PointsMaterial | null = branch?.material ?? null;
      let points: THREE.Points | null = branch?.points ?? null;

      if (points && geometry && material) {
        geometry.dispose();
        material.dispose();
        group.remove(points);
        delete branches[name];
      }
      geometry = new THREE.BufferGeometry();

      const positionsArray = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const index = i * 3;

        positionsArray[index] = (Math.random() - 0.5) * randomLength;
        positionsArray[index + 1] = (Math.random() - 0.5) * randomLength;
        positionsArray[index + 2] = (Math.random() - 0.7) * randomLength;

        const color = new THREE.Color(innerColor);
        const mixedColor = color.clone();
        mixedColor.lerp(new THREE.Color(outsideColor), Math.random());

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

      const particleTexture = new THREE.TextureLoader().load(texture);

      material = new THREE.PointsMaterial({
        map: particleTexture,
        size: size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
      });

      points = new THREE.Points(geometry, material);
      group.add(points);

      branches[name] = {
        geometry,
        material,
        points,
      };
    }

    const generateBranch = (options: {
      name: string;
      patternList: number[];
      startRadian: number;
      group: THREE.Group;
      radianUnit: number;
      branchCount: number;
    }) => {
      const {
        name,
        patternList,
        startRadian,
        group,
        radianUnit = Math.PI / 9,
        branchCount,
      } = options;
      const branch = branches[name];

      let geometry: THREE.BufferGeometry | null = branch?.geometry ?? null;
      let material: THREE.PointsMaterial | null = branch?.material ?? null;
      let points: THREE.Points | null = branch?.points ?? null;

      if (points && geometry && material) {
        geometry.dispose();
        material.dispose();
        group.remove(points);
        delete branches[name];
      }
      geometry = new THREE.BufferGeometry();

      const branchCurve1 = new THREE.CatmullRomCurve3(
        patternList.map(
          (value, index) =>
            new THREE.Vector3(index * radianUnit + startRadian, value, 0)
        ),
        parameters.closed,
        parameters.curveType as THREE.CurveType,
        parameters.tension
      );

      const circleStartCount = 10000;
      const positionsArray = new Float32Array(
        (parameters.count + circleStartCount) * 3
      );
      const colors = new Float32Array(
        (parameters.count + circleStartCount) * 3
      );

      for (let i = 0; i < circleStartCount; i++) {
        const index = i * 3;
        const theta = Math.acos(2 * Math.random() - 1); // Polar angle: 0 to π
        const phi = 2 * Math.PI * Math.random(); // Azimuthal angle: 0 to 2π

        const length = Math.random() * 0.5;
        const x = length * Math.sin(theta) * Math.cos(phi);
        const y = length * Math.sin(theta) * Math.sin(phi);
        const z = length * Math.cos(theta);
        // const x = Math.random() * 1;
        // const y = Math.random() * 1;
        // const z = Math.random() * 1;

        positionsArray[index] = x;
        positionsArray[index + 1] = y;
        positionsArray[index + 2] = z;
        // positionsArray[index] = 0;
        // positionsArray[index + 1] = 0;
        // positionsArray[index + 2] = 0;

        const color = new THREE.Color(parameters.insideColor);
        colors[index] = color.r;
        colors[index + 1] = color.g;
        colors[index + 2] = color.b;
      }

      for (let i = 0; i < parameters.count; i++) {
        const index = circleStartCount + i * 3 - 1;

        const t = i / parameters.count;
        let { y: radius, x: radian } = branchCurve1.getPoint(t);

        if (i > 1) {
          const prevCurve = branchCurve1.getPoint((i - 1) / parameters.count);

          radius =
            radius * (Math.round(Math.random() * branchCount) / branchCount);
          // radian = radian * Math.PI * (Math.round(Math.random() * 4) / 4);

          if (prevCurve) {
            const currentPoint = branchCurve1.getPoint(t);
            const directionVector = new THREE.Vector3().subVectors(
              currentPoint,
              prevCurve
            );

            radian +=
              Math.PI *
              Math.pow(Math.random() * 2, parameters.randomnessPower) *
              (Math.random() > 0.5 ? 1 : -1) *
              directionVector.length() *
              1;

            radius +=
              Math.pow(Math.random() * 2, parameters.randomnessPower) *
              (Math.random() > 0.5 ? 1 : -1) *
              directionVector.length() *
              2;
          }
        }

        const x = radius * Math.cos(radian);
        const y = radius * Math.sin(radian);

        const randomY =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radian;

        const randomX =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() > 0.5 ? 1 : -1) *
          parameters.randomness *
          radian;

        const randomZ =
          Math.pow(Math.random(), parameters.randomnessPower) *
          // Math.random() *
          (Math.random() > 0.5 ? 1 : -1) *
          parameters.randomness *
          t *
          10;

        positionsArray[index] = y + randomY;
        positionsArray[index + 1] = x + randomX;
        positionsArray[index + 2] = randomZ;

        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, t);

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
        new URL("./textures/particles/1.png", import.meta.url).href
      );
      material = new THREE.PointsMaterial({
        map: particleTexture,
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        depthTest: true,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });

      points = new THREE.Points(geometry, material);
      group.add(points);

      // center sphere
      const centerSphere = new THREE.SphereGeometry(1, 36, 36);
      const centerSphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xc45e62,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        // depthWrite: false,
        depthTest: true,
      });
      const centerSphereMesh = new THREE.Mesh(
        centerSphere,
        centerSphereMaterial
      );
      // group.add(centerSphereMesh);

      branches[name] = {
        geometry,
        material,
        points,
      };
    };

    let galaxyGroup = new THREE.Group();
    let galaxyGroupLeft = new THREE.Group();
    let startGroup = new THREE.Group();

    const generateGalaxy = () => {
      scene.remove(galaxyGroup);
      scene.remove(galaxyGroupLeft);
      scene.remove(startGroup);

      galaxyGroup = new THREE.Group();
      galaxyGroupLeft = new THREE.Group();
      startGroup = new THREE.Group();

      const starList = [
        new URL("./textures/particles/star_01.png", import.meta.url).href,
        new URL("./textures/particles/star_02.png", import.meta.url).href,
        new URL("./textures/particles/star_03.png", import.meta.url).href,
        new URL("./textures/particles/star_04.png", import.meta.url).href,
        new URL("./textures/particles/star_05.png", import.meta.url).href,
        new URL("./textures/particles/star_06.png", import.meta.url).href,
        new URL("./textures/particles/star_07.png", import.meta.url).href,
        new URL("./textures/particles/star_08.png", import.meta.url).href,
        new URL("./textures/particles/star_09.png", import.meta.url).href,
      ];

      // random select star texture
      const randomIndex = Math.floor(Math.random() * starList.length);

      generateStars({
        name: "stars",
        group: startGroup,
        count: 100,
        innerColor: "#ffffff",
        outsideColor: "#ffffff",
        size: 5,
        texture: new URL("./textures/particles/star_08.png", import.meta.url)
          .href,
        randomLength: 200,
      });
      generateStars({
        name: "stars2",
        group: startGroup,
        count: 10000,
        innerColor: "#9c2b19",
        outsideColor: "#ffffff",
        size: 0.3,
        texture: new URL("./textures/particles/4.png", import.meta.url).href,
        randomLength: 20000,
      });
      generateStars({
        name: "stars3",
        group: startGroup,
        count: 100,
        innerColor: "#179daa",
        outsideColor: "#179daa",
        size: 2,
        texture: new URL("./textures/particles/star_05.png", import.meta.url)
          .href,
        randomLength: 200,
      });
      generateStars({
        name: "stars3",
        group: startGroup,
        count: 500,
        innerColor: "#ffd8ad",
        outsideColor: "#d85d3a",
        size: 0.3,
        texture: new URL("./textures/particles/star_05.png", import.meta.url)
          .href,
        randomLength: 200,
      });
      // flare_01.png
      scene.add(startGroup);

      generateBranch({
        name: "branch1",
        patternList: [
          1.2, 1.2, 1.2, 1.1, 1.1, 1, 1.1, 1.2, 1.3, 1.4, 1.6, 2.2, 3.2, 3.5,
          3.4, 3.5, 3.5, 3.5, 4, 4.9, 6.9, 7.4, 9.2, 9.9, 9, 8, 6.9, 6.5, 6.7,
          8, 9.6, 12,
        ],
        startRadian: Math.PI * 2 * (180 / 360),
        group: galaxyGroup,
        radianUnit: -Math.PI / 9,
        branchCount: 7,
      });
      generateBranch({
        name: "branch2",
        patternList: [
          2, 2.2, 2.1, 1.9, 2, 2.1, 2.3, 2.3, 2.3, 2.2, 2.1, 2, 1.9, 2.1, 2.3,
          2.7, 3.5, 5.1, 7.7, 9.4, 10.2, 9.9, 10.5, 10, 9.8, 9.5, 9.5, 9.7,
          11.2, 13, 16,
        ],
        startRadian: Math.PI * 1.6,
        group: galaxyGroup,
        radianUnit: -Math.PI / 9,
        branchCount: 10,
      });

      galaxyGroup.position.x = 7;
      scene.add(galaxyGroup);

      generateBranch({
        name: "branch3",
        patternList: [
          0.5, 0.6, 0.9, 1, 1.2, 1.3, 1.4, 1.4, 1.4, 1.4, 1.5, 1.5, 1.5, 1.6,
          1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.6, 1.6, 1.6, 1.7, 1.7,
          1.7, 1.8, 2, 2.6, 2.3, 2.4, 2.5, 2.6, 2.7, 2.7, 3.4, 3.9, 4.5, 5.6,
          7.1, 8.3, 9.3, 10.7, 14,
        ],
        startRadian: Math.PI * 0.2,
        group: galaxyGroupLeft,
        radianUnit: Math.PI / 18,
        branchCount: 5,
      });
      generateBranch({
        name: "branch4s",
        patternList: [
          0.2, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 1.9, 1.9,
          1.9, 2, 2.1, 2.3, 2.5, 2.7, 2.7, 2.8, 2.7, 2.7, 2.7, 2.7, 2.7, 2.6,
          2.7, 2.7, 2.9, 3.2, 3.4, 3.6, 4, 4.8, 5.5, 6.5, 7.5, 9.5, 12, 14,
        ],
        startRadian: Math.PI * 1.4,
        group: galaxyGroupLeft,
        radianUnit: Math.PI / 18,
        branchCount: 5,
      });

      galaxyGroupLeft.position.x = -7;
      galaxyGroupLeft.position.y = 2;
      scene.add(galaxyGroupLeft);
    };

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
    gui
      .add(parameters, "tension")
      .min(0)
      .max(100)
      .step(0.01)
      .onFinishChange(generateGalaxy);

    gui.add(parameters, "closed").onFinishChange(generateGalaxy);
    gui.add(parameters, "curveType").onFinishChange(generateGalaxy);

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
      10000
    );
    // camera.position.x = 1;
    // camera.position.y = 1;
    camera.position.z = 25;
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
