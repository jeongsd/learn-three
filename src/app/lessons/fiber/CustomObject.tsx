import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

function CustomObject() {
  const verticesCount = 10 * 3;

  const geometryRef = useRef<THREE.BufferGeometry>(null);

  useEffect(() => {
    if (!geometryRef.current) return;
    geometryRef.current.computeVertexNormals();
  }, [verticesCount]);

  const positions = new Float32Array(verticesCount * 3);

  for (let i = 0; i < verticesCount; i++) {
    positions[i * 3] = Math.random() * 10 - 5;
    positions[i * 3 + 1] = Math.random() * 10 - 5;
    positions[i * 3 + 2] = Math.random() * 10 - 5;
  }

  return (
    <>
      <mesh>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute
            attach="attributes-position"
            count={verticesCount}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>
        <meshStandardMaterial color="red" side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

export default CustomObject;
