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

export function renderBushes(scene: THREE.Scene) {
  const bush1 = renderBush(scene);
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);

  const bush2 = renderBush(scene);
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);

  const bush3 = renderBush(scene);
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);

  const bush4 = renderBush(scene);
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.05, 2.6);
}
