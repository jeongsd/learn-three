import * as THREE from "three";

export function renderGraves(scene: THREE.Scene) {
  const graves = new THREE.Group();
  scene.add(graves);

  const colorTexture = new THREE.TextureLoader().load(
    new URL(
      "./rock/MetalCorrodedHeavy001_COL_2K_METALNESS.jpg",
      import.meta.url
    ).href
  );
  colorTexture.colorSpace = THREE.SRGBColorSpace;

  // graveColorTexture.repeat.set(0.3, 0.4)
  colorTexture.repeat.set(0.3, 0.4);
  colorTexture.wrapS = THREE.RepeatWrapping;
  colorTexture.wrapT = THREE.RepeatWrapping;

  const roughnessTexture = new THREE.TextureLoader().load(
    new URL(
      "./rock/MetalCorrodedHeavy001_ROUGHNESS_2K_METALNESS.jpg",
      import.meta.url
    ).href
  );
  const metalnessTexture = new THREE.TextureLoader().load(
    new URL(
      "./rock/MetalCorrodedHeavy001_METALNESS_2K_METALNESS.jpg",
      import.meta.url
    ).href
  );

  const normalTexture = new THREE.TextureLoader().load(
    new URL(
      "./rock/MetalCorrodedHeavy001_NRM_2K_METALNESS.jpg",
      import.meta.url
    ).href
  );
  const displacementTexture = new THREE.TextureLoader().load(
    new URL(
      "./rock/MetalCorrodedHeavy001_DISP_2K_METALNESS.jpg",
      import.meta.url
    ).href
  );

  const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2, 100, 100, 100);
  const graveMaterial = new THREE.MeshStandardMaterial({
    map: colorTexture,
    roughnessMap: roughnessTexture,
    metalnessMap: metalnessTexture,
    normalMap: normalTexture,
    displacementMap: displacementTexture,
    displacementScale: 0.001,
  });

  for (let i = 0; i < 50; i++) {
    // const grave = renderGrave(graves);
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    graves.add(grave);

    const radian = Math.random() * Math.PI * 2;

    grave.position.x = Math.cos(radian) * (3 + Math.random() * 7);
    grave.position.z = Math.sin(radian) * (3 + Math.random() * 7);

    grave.rotation.x = Math.random() - 0.5;
    grave.rotation.y = Math.random() - 0.5;
    grave.rotation.z = Math.random() - 0.5;

    grave.castShadow = true;
    grave.receiveShadow = true;
    // grave.position.x
  }
}
