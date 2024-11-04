import * as THREE from "three";
import { Sky } from "three/addons/objects/Sky.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/examples/jsm/misc/Timer.js";
import { renderFloor } from "./renderFloor";
import { renderHouse } from "./renderHouse";
import { renderBushes } from "./renderBushes";
import { renderGraves } from "./renderGraves";
import { renderGhost } from "./renderGhost";

export function render(el: HTMLCanvasElement) {
  const canvas = el;

  const scene = new THREE.Scene();

  const sky = new Sky();

  sky.material.uniforms["turbidity"].value = 10;
  sky.material.uniforms["rayleigh"].value = 0.1;
  sky.material.uniforms["mieCoefficient"].value = 0.005;
  sky.material.uniforms["mieDirectionalG"].value = 0.7;
  sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);
  sky.scale.set(100, 100, 100);
  // scene.add(sky);

  scene.fog = new THREE.Fog("#000000", 1, 20);
  // scene.fog = new THREE.FogExp2("#ff0000", 100);

  const ambientLight = new THREE.AmbientLight("#862288", 0.275);

  scene.add(ambientLight);

  // const directionalLight = new THREE.DirectionalLight("#bb0000", 0.3);
  const directionalLight = new THREE.DirectionalLight("#bb0755", 1);
  directionalLight.position.set(3, 2, -8);
  scene.add(directionalLight);
  // Cast and receive
  directionalLight.castShadow = true;

  // Mappings
  directionalLight.shadow.mapSize.width = 256;
  directionalLight.shadow.mapSize.height = 256;
  directionalLight.shadow.camera.top = 8;
  directionalLight.shadow.camera.right = 8;
  directionalLight.shadow.camera.bottom = -8;
  directionalLight.shadow.camera.left = -8;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 20;

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
  camera.position.x = 5;
  camera.position.y = 5;
  camera.position.z = 5;
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

  renderFloor(scene);
  renderHouse(scene);
  renderBushes(scene);
  renderGraves(scene);
  const { ghost1, ghost2, ghost3 } = renderGhost(scene);

  /**
   * Animate
   */

  const timer = new Timer();

  let requestId: number;
  const tick = () => {
    timer.update();
    const elapsedTime = timer.getElapsed();
    const ghost1Angle = elapsedTime;

    ghost1.position.x = Math.cos(elapsedTime) * 4;
    ghost1.position.z = Math.sin(elapsedTime) * 4;

    ghost1.position.y =
      1 +
      Math.sin(ghost1Angle) *
        Math.sin(ghost1Angle * 2.34) *
        Math.sin(ghost1Angle * 3.45);

    const ghost2Angle = -elapsedTime * 0.38;

    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y =
      1 +
      Math.sin(ghost2Angle) *
        Math.sin(ghost2Angle * 2.34) *
        Math.sin(ghost2Angle * 3.45);

    const ghost3Angle = elapsedTime * 0.23;
    ghost3.position.x = Math.cos(ghost3Angle) * 6;
    ghost3.position.z = Math.sin(ghost3Angle) * 6;
    ghost3.position.y =
      1 +
      Math.sin(ghost3Angle) *
        Math.sin(ghost3Angle * 2.34) *
        Math.sin(ghost3Angle * 3.45);

    controls.update();
    renderer.render(scene, camera);
    requestId = window.requestAnimationFrame(tick);
  };

  tick();

  // clear
  return () => {
    // clear
    scene.clear();
    cancelAnimationFrame(requestId);
  };
}
