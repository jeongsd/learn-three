import { useFrame } from '@react-three/fiber'
import { useHelper, OrbitControls, BakeShadows, SoftShadows, AccumulativeShadows, RandomizedLight, ContactShadows, Sky } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'

export default function Experience() {
  const cube = useRef<any>()
  const directionalLight = useRef<any>()

  const { sunPosition } = useControls('sky', {
    sunPosition: { value: [1, 2, 3] }
  })

  useHelper(directionalLight, THREE.DirectionalLightHelper, 1)


  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2

    // const time = state.clock.elapsedTime
    // cube.current.position.x = 2 + Math.sin(time)
  })

  return <>
    <Sky sunPosition={sunPosition} />
    <ContactShadows
      color="1d8f75"
      opacity={0.4}
      blur={2.8}
      far={5} resolution={512} scale={10} position={[0, - 0.99, 0]}
      frames={1}
    />
    {/* <BakeShadows /> */}
    {/* <SoftShadows size={25} samples={10} focus={0} /> */}

    {/* <AccumulativeShadows
      frames={Infinity}
      scale={10} position={[0, - 0.99, 0]} color="#316d39"
      opacity={0.8}
      temporal
      blend={100}
    >
      <RandomizedLight
        amount={8}
        radius={1}
        ambient={0.5}
        intensity={3}
        position={[1, 2, 3]}
        bias={0.001}
      // amount={8}
      // castShadow
      />

    </AccumulativeShadows> */}

    <color args={['ivory']} attach="background" />

    <Perf position="top-left" />

    <OrbitControls makeDefault />

    <directionalLight
      shadow-mapSize={[1024, 1024]}
      shadow-camera-near={1}
      shadow-camera-far={10}
      shadow-camera-top={5}
      shadow-camera-right={5}
      shadow-camera-bottom={- 5}
      shadow-camera-left={- 5}
      castShadow ref={directionalLight} position={[1, 2, 3]} intensity={4.5} />
    <ambientLight intensity={1.5} />

    <mesh castShadow position-x={- 2}>
      <sphereGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>

    <mesh castShadow ref={cube} position-x={2} scale={1.5}>
      <boxGeometry />
      <meshStandardMaterial color="mediumpurple" />
    </mesh>

    <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
      <planeGeometry />
      <meshStandardMaterial color="greenyellow" />
    </mesh>

  </>
}