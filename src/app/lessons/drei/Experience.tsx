import { Perf } from 'r3f-perf'
import { Text, Html, TransformControls, OrbitControls, PivotControls, Float, MeshReflectorMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef } from 'react'



export default function Experience() {

  const cube = useRef()
  const sphere = useRef()


  const { position } = useControls({
    position:
    {
      value: { x: - 2, y: 0 },
      step: 0.01
    }
  })



  return <>

    <Perf position="top-left" />


    <OrbitControls makeDefault />

    <directionalLight position={[1, 2, 3]} intensity={4.5} />
    <ambientLight intensity={1.5} />

    <PivotControls anchor={[0, 0, 0]}
      depthTest={false}
      lineWidth={4}
      axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
      scale={100}
      fixed
    >
      <mesh position={[position.x, position.y, 0]} ref={sphere} scale={2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </PivotControls>

    <Float>
      <Html
        occlude={[sphere, cube]}
        distanceFactor={8}

        center wrapperClass="label" position={[1, 1, 0]}>That's a sphere 👍</Html>
    </Float>


    <Float speed={2}
      floatIntensity={2}>

      <mesh ref={cube} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
    </Float>
    <TransformControls object={cube} />

    <mesh ref={sphere} position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
      <planeGeometry />
      <MeshReflectorMaterial color="greenyellow" resolution={2048} mirror={0.5} />
    </mesh>
    <Float speed={1}>
      <Text font="/bangers-v20-latin-regular.woff"
        fontSize={1}
        color="salmon"
        position-y={2}
        maxWidth={2}

        textAlign="center"
      >I LOVE R3F</Text>
    </Float>




  </>
}