import * as THREE from "three";

function renderBush(scene: THREE.Object3D) {
  const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
  const bushMaterial = new THREE.MeshStandardMaterial({
    color: "#006600",
  });

  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  scene.add(bush);
  return bush;
}

export function renderGhost(scene: THREE.Scene) {
  const ghost1 = new THREE.PointLight("#8800ff", 2);
  const ghost2 = new THREE.PointLight("#ff0088", 3);
  const ghost3 = new THREE.PointLight("#ff0000", 4);

  ghost1.castShadow = true;
  ghost2.castShadow = true;
  ghost3.castShadow = true;

  ghost1.shadow.mapSize.width = 256;
  ghost1.shadow.mapSize.height = 256;
  ghost1.shadow.camera.far = 10;

  ghost2.shadow.mapSize.width = 256;
  ghost2.shadow.mapSize.height = 256;
  ghost2.shadow.camera.far = 10;

  ghost3.shadow.mapSize.width = 256;
  ghost3.shadow.mapSize.height = 256;
  ghost3.shadow.camera.far = 10;

  // Add PointLightHelpers
  const ghost1Helper = new THREE.PointLightHelper(ghost1);
  const ghost2Helper = new THREE.PointLightHelper(ghost2);
  const ghost3Helper = new THREE.PointLightHelper(ghost3);

  scene.add(ghost1, ghost2, ghost3, ghost1Helper, ghost2Helper, ghost3Helper);
  return { ghost1, ghost2, ghost3 };
}
