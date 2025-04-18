'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;
    /**
   * Sizes
   */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };


    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = '';

      const gui = new GUI();

      /**
       * Base
       */
      // Canvas
      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      /**
       * Models
       */
      const gltfLoader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      gltfLoader.setDRACOLoader(dracoLoader)


      let mixer = null
      gltfLoader.load(
        '/models/pizza.glb',
        // public/
        (gltf) => {


          // for (const child of gltf.scene.children) {
          //   scene.add(child)
          // }

          // while (gltf.scene.children.length) {
          //   scene.add(gltf.scene.children[0])
          // }


          // mixer = new THREE.AnimationMixer(gltf.scene)
          // const action = mixer.clipAction(gltf.animations[2])

          // action.play()

          // console.log(gltf)
          // gltf.scene.scale.set(0.025, 0.025, 0.025)
          // gltf.scene.children[0].position.y = 1
          scene.add(gltf.scene.children[0])

        },

      )

      /**
 * Floor
 */
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
          color: '#444444',
          metalness: 0,
          roughness: 0.5
        })
      )
      floor.receiveShadow = true
      floor.rotation.x = - Math.PI * 0.5
      scene.add(floor)

      /**
      * Lights
      */
      const ambientLight = new THREE.AmbientLight(0xffffff, 10)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.set(1024, 1024)
      directionalLight.shadow.camera.far = 15
      directionalLight.shadow.camera.left = - 7
      directionalLight.shadow.camera.top = 7
      directionalLight.shadow.camera.right = 7
      directionalLight.shadow.camera.bottom = - 7
      directionalLight.position.set(5, 5, 5)
      scene.add(directionalLight)

      /**
       * Sizes
       */
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      window.addEventListener('resize', () => {
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
        100,
      );
      camera.position.set(-3, 3, 3);
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
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


      /**
       * Animate
       */
      const clock = new THREE.Clock();
      let oldElapsedTime = 0;

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;

        if (mixer) {
          mixer.update(deltaTime * 2)
        }



        // Update physics

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

  return <canvas style={{ display: 'block' }} ref={el}></canvas>;
}

export default Page;