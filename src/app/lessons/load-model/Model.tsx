import { useLoader } from "@react-three/fiber"
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js"
import { Clone, useGLTF } from '@react-three/drei'

export default function Model() {
    const model = useGLTF('/hamburger.glb')
    // const model = useLoader(
    //     GLTFLoader,
    //     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    //     (loader) => {
    //         const dracoLoader = new DRACOLoader()
    //         dracoLoader.setDecoderPath('./draco/')
    //         loader.setDRACOLoader(dracoLoader)
    //     }
    // )

    return <>
        <Clone object={model.scene} scale={0.35} position-x={- 4} />
        <Clone object={model.scene} scale={0.35} position-x={0} />
        <Clone object={model.scene} scale={0.35} position-x={4} />
    </>
}

// useGLTF.preload('/hamburger.glb')