'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import CANNON from 'cannon';


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
   * Raycaster
   */
      const raycaster = new THREE.Raycaster()
      const rayOrigin = new THREE.Vector3(- 3, 0, 0)
      const rayDirection = new THREE.Vector3(10, 0, 0)
      rayDirection.normalize()
      raycaster.set(rayOrigin, rayDirection)

      /**
 * Objects
 */
      const object1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
      )
      object1.position.x = - 2

      const object2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
      )

      const object3 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
      )
      object3.position.x = 2
      scene.add(object1, object2, object3)

      /**
 * Lights
 */
      // Ambient light
      const ambientLight = new THREE.AmbientLight('#ffffff', 0.9)
      scene.add(ambientLight)

      // Directional light
      const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1)
      directionalLight.position.set(1, 2, 3)
      scene.add(directionalLight)

      const gltfLoader = new GLTFLoader()


      let fox: any = null
      gltfLoader.load(
        '/models/Fox/glTF/Fox.gltf',
        // public/
        (gltf) => {


          console.log(gltf)
          gltf.scene.children[0].scale.set(0.025, 0.025, 0.025)
          // fox = gltf.scene.children[0]
          fox = gltf.scene
          scene.add(fox)

        },

      )


      // const intersect = raycaster.intersectObject(object2)
      // console.log(intersect)

      // const intersects = raycaster.intersectObjects([object1, object2, object3])
      // console.log(intersects)


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
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
      camera.position.z = 3
      scene.add(camera)

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


      const mouse = new THREE.Vector2()

      window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX / sizes.width * 2 - 1
        mouse.y = - (event.clientY / sizes.height) * 2 + 1

        // console.log(mouse)
      })

      /**
       * Animate
       */
      const clock = new THREE.Clock();
      let oldElapsedTime = 0;

      let currentIntersect: any = null

      window.addEventListener('click', () => {
        if (currentIntersect) {
          switch (currentIntersect.object) {
            case object1:
              console.log('click on object 1')
              break

            case object2:
              console.log('click on object 2')
              break

            case object3:
              console.log('click on object 3')
              break
          }
        }
      })

      const tick = () => {
        // const elapsedTime = clock.getElapsedTime();
        // const deltaTime = elapsedTime - oldElapsedTime;
        // oldElapsedTime = elapsedTime;

        const elapsedTime = clock.getElapsedTime()

        // Animate objects
        object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
        object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
        object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

        raycaster.setFromCamera(mouse, camera)


        if (fox) {
          const modelIntersects = raycaster.intersectObject(fox)

          if (modelIntersects.length) {
            fox.scale.set(1.2, 1.2, 1.2)
          }
          else {
            fox.scale.set(1, 1, 1)
          }
        }




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

  return <canvas style={{ display: 'block' }} ref={el}></canvas>;
}

export default Page;