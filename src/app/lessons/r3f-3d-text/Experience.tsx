import { Center, OrbitControls, Text3D, useMatcapTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useRef, useState } from 'react'
import * as THREE from 'three'

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32)

export default function Experience() {
  const [matcapTexture] = useMatcapTexture('422509_C89536_824512_0A0604', 256)

  const tempArray = Array(200)

  const donutsGroup = useRef<any[]>([])

  useFrame((state, delta) => {
    for (const donut of donutsGroup.current) {
      donut.rotation.y += delta * 0.2
      donut.rotation.x += delta * 3
      donut.rotation.z += delta * 0.2
    }
  })
  // const [torusGeometry, setTorusGeometry] = useState()


  return <>

    <Perf position="top-left" />

    <OrbitControls makeDefault />

    {/* <mesh scale={1.5}>
      <boxGeometry />
      <meshNormalMaterial />
    </mesh> */}

    <Center>
      <Text3D size={0.75}
        height={0.2}
        curveSegments={1}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        font="/fonts/hello.json">
        Whereas disregard and contempt
        <meshMatcapMaterial matcap={matcapTexture} />
      </Text3D>
    </Center>

    {
      ([...tempArray]).map((_, index) => (
        <mesh
          ref={mesh => {
            donutsGroup.current[index] = mesh
          }}
          scale={Math.random() * 0.5}
          key={index}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20]
          }
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          ]}
          geometry={torusGeometry}
        >

          <meshMatcapMaterial matcap={matcapTexture} />
        </mesh>
      ))
    }
  </>
}