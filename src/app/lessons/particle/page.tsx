// @refresh reset

"use client";

import { useEffect, useRef } from "react";
import Stats from "stats.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function cartesianToGeographic(vector: THREE.Vector3) {
  const normalized = vector.clone().normalize();
  const x = normalized.x;
  const y = normalized.y;
  const z = normalized.z;

  // Latitude (lat) 계산
  const lat = Math.atan2(Math.sqrt(x * x + y * y), z);

  // Longitude (lon) 계산
  const lon = Math.atan2(y, x);

  return {
    lat,
    lon,
  };
}
function Page() {
  const el = useRef<HTMLCanvasElement>(null);
  const stats = useRef<Stats | null>(null);
  useEffect(() => {
    let requestId: number;

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";
      stats.current = new Stats();
      document.body.appendChild(stats.current.dom);

      const canvas = el.current;
      const scene = new THREE.Scene();

      // const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
      // const particleMaterial = new THREE.PointsMaterial({
      //   size: 0.02,
      //   sizeAttenuation: true,
      // });

      const particleGeometry = new THREE.BufferGeometry();

      const count = 2;

      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const stars = [
        { color: "Blue", rgb: [68, 85, 255] },
        { color: "Blue-White", rgb: [120, 170, 255] },
        { color: "White", rgb: [255, 255, 255] },
        { color: "Yellow-White", rgb: [255, 255, 200] },
        { color: "Yellow", rgb: [255, 255, 160] },
        { color: "Orange", rgb: [255, 200, 120] },
        { color: "Red", rgb: [255, 100, 100] },
      ];
      for (let i = 0; i < count; i++) {
        const index = i * 3;
        const lat = Math.random() * Math.PI;
        const lon = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2;

        const x = Math.sin(lat) * Math.cos(lon);
        const y = Math.sin(lat) * Math.sin(lon);
        const z = Math.cos(lat);

        positions[index] = x * radius;
        positions[index + 1] = y * radius;
        positions[index + 2] = z * radius;

        // const result = cartesianToGeographic(
        //   new THREE.Vector3(
        //     positions[index],
        //     positions[index + 1],
        //     positions[index + 2]
        //   )
        // );

        const color = stars[Math.floor(Math.random() * stars.length)];

        colors[index] = color.rgb[0] / 255;
        colors[index + 1] = color.rgb[1] / 255;
        colors[index + 2] = color.rgb[2] / 255;
      }

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particleGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
      );

      const particleTexture = new THREE.TextureLoader().load(
        new URL("./textures/particles/1.png", import.meta.url).href
      );
      const particleMaterial = new THREE.PointsMaterial({
        alphaMap: particleTexture,
        size: 0.02,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
        vertexColors: true,
      });

      const particle = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particle);

      // Cube
      // const cube = new THREE.Mesh(
      //   new THREE.BoxGeometry(1, 1, 1),
      //   new THREE.MeshBasicMaterial()
      // );
      // scene.add(cube);

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
        0.0001,
        10000
      );
      camera.position.x = 1;
      camera.position.y = 1;
      camera.position.z = 1;
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
        stats.current?.begin();
        const elapsedTime = clock.getElapsedTime();

        // particleGeometry.attributes.color.needsUpdate = true;
        // particle.rotation.y = elapsedTime * 0.2;

        // console.log();

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const x = particleGeometry.attributes.position.array[i3];
          const y = particleGeometry.attributes.position.array[i3 + 1];
          const z = particleGeometry.attributes.position.array[i3 + 2];
          const { lat, lon } = cartesianToGeographic(
            new THREE.Vector3(x, y, z)
          );

          const vector = new THREE.Vector3(x, y, z);

          const radius = Math.abs(Math.sin(elapsedTime)) * 4;
          // console.log(radius);
          // const radius = Math.sin(elapsedTime) * 4;
          // const radius = vector.length();
          //  Math.sin(elapsedTime);
          // console.log(radius);

          // const newX = Math.sin(lat) * Math.cos(lon);
          // const newY = Math.sin(lat) * Math.sin(lon);
          // const newZ = Math.cos(lat);
          // if (!newX || !newY || !newZ) {
          //   // console.log(lat, lon);
          //   continue;
          // }

          // console.log("vector2", vector, { x, y, z });
          vector.setLength(radius);
          console.log("vector3", vector);

          // particleGeometry.attributes.position.array[i3] = newX * radius;
          // particleGeometry.attributes.position.array[i3 + 1] = newY * radius;
          // particleGeometry.attributes.position.array[i3 + 2] = newZ * radius;
          // particleGeometry.attributes.position.array[i3] = newX * radius;
          // particleGeometry.attributes.position.array[i3 + 1] = newY * radius;
          // particleGeometry.attributes.position.array[i3 + 2] = newZ * radius;

          particleGeometry.attributes.position.array[i3] = vector.x;
          particleGeometry.attributes.position.array[i3 + 1] = vector.y;
          particleGeometry.attributes.position.array[i3 + 2] = vector.z;

          // particleGeometry.attributes.position.array[i3 + 1] =
          //   latitude * (Math.PI / 180);
          // particleGeometry.attributes.position.array[i3 + 2] =
          //   longitude * (Math.PI / 180);
          // const lat = Math.random() * Math.PI;
          // const lon = Math.random() * Math.PI * 2;
          // const radius = Math.random() * 2;

          // const x = Math.sin(lat) * Math.cos(lon);
          // const y = Math.sin(lat) * Math.sin(lon);
          // const z = Math.cos(lat);

          // positions[index] = x * radius;
          // positions[index + 1] = y * radius;
          // positions[index + 2] = z * radius;
        }

        particleGeometry.attributes.position.needsUpdate = true;

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);
        stats.current?.end();
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
