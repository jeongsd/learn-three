import * as THREE from "three";

function renderWall(group: THREE.Object3D) {
  const colorTexture = new THREE.TextureLoader().load(
    new URL(
      "./brick/Poliigon_BrickWallReclaimed_8320_BaseColor.jpg",
      import.meta.url
    ).href
  );
  colorTexture.colorSpace = THREE.SRGBColorSpace;

  const roughnessTexture = new THREE.TextureLoader().load(
    new URL(
      "./brick/Poliigon_BrickWallReclaimed_8320_Roughness.jpg",
      import.meta.url
    ).href
  );

  const normalTexture = new THREE.TextureLoader().load(
    new URL(
      "./brick/Poliigon_BrickWallReclaimed_8320_Normal.png",
      import.meta.url
    ).href
  );

  const metalnessTexture = new THREE.TextureLoader().load(
    new URL(
      "./brick/Poliigon_BrickWallReclaimed_8320_Metallic.jpg",
      import.meta.url
    ).href
  );

  const ambientOcclusionTexture = new THREE.TextureLoader().load(
    new URL(
      "./brick/Poliigon_BrickWallReclaimed_8320_AmbientOcclusion.jpg",
      import.meta.url
    ).href
  );

  ambientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  ambientOcclusionTexture.wrapT = THREE.RepeatWrapping;

  const displacementTexture = new THREE.TextureLoader().load(
    new URL(
      "./brick/Poliigon_BrickWallReclaimed_8320_Displacement.jpg",
      import.meta.url
    ).href
  );

  displacementTexture.wrapS = THREE.RepeatWrapping;
  displacementTexture.wrapT = THREE.RepeatWrapping;

  // https://www.poliigon.com/texture/gold-paint-metal-texture/7253
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4, 100, 100, 100),
    new THREE.MeshStandardMaterial({
      map: colorTexture,
      roughnessMap: roughnessTexture,
      normalMap: normalTexture,
      metalnessMap: metalnessTexture,
      aoMap: ambientOcclusionTexture,
      displacementMap: displacementTexture,
      displacementScale: 0.002,
    })
  );
  wall.position.y = 1.25;
  wall.castShadow = true;
  wall.receiveShadow = true;

  group.add(wall);
}

function renderRoof(group: THREE.Object3D) {
  const colorTexture = new THREE.TextureLoader().load(
    new URL(
      "./rattanWeave/Poliigon_RattanWeave_6945_BaseColor.jpg",
      import.meta.url
    ).href
  );
  colorTexture.colorSpace = THREE.SRGBColorSpace;
  colorTexture.repeat.set(10, 1);
  colorTexture.wrapS = THREE.RepeatWrapping;

  const roughnessTexture = new THREE.TextureLoader().load(
    new URL(
      "./rattanWeave/Poliigon_RattanWeave_6945_Roughness.jpg",
      import.meta.url
    ).href
  );
  roughnessTexture.repeat.set(10, 1);
  roughnessTexture.wrapS = THREE.RepeatWrapping;

  const normalTexture = new THREE.TextureLoader().load(
    new URL(
      "./rattanWeave/Poliigon_RattanWeave_6945_Normal.png",
      import.meta.url
    ).href
  );
  normalTexture.repeat.set(10, 1);
  normalTexture.wrapS = THREE.RepeatWrapping;

  const metalnessTexture = new THREE.TextureLoader().load(
    new URL(
      "./rattanWeave/Poliigon_RattanWeave_6945_Metallic.jpg",
      import.meta.url
    ).href
  );
  metalnessTexture.repeat.set(10, 1);
  metalnessTexture.wrapS = THREE.RepeatWrapping;

  const displacementTexture = new THREE.TextureLoader().load(
    new URL(
      "./rattanWeave/Poliigon_RattanWeave_6945_Displacement.jpg",
      import.meta.url
    ).href
  );
  displacementTexture.repeat.set(10, 1);
  displacementTexture.wrapS = THREE.RepeatWrapping;

  const aoTexture = new THREE.TextureLoader().load(
    new URL(
      "./rattanWeave/Poliigon_RattanWeave_6945_AmbientOcclusion.jpg",
      import.meta.url
    ).href
  );

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4, 200),
    new THREE.MeshStandardMaterial({
      map: colorTexture,
      roughnessMap: roughnessTexture,
      normalMap: normalTexture,
      metalnessMap: metalnessTexture,
      displacementMap: displacementTexture,
      displacementScale: 0.2,
      aoMap: aoTexture,
    })
  );

  roof.position.y = 2.5 + 0.75;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);
}

function renderDoor(group: THREE.Object3D) {
  const textureLoader = new THREE.TextureLoader();
  // Door
  const doorColorTexture = textureLoader.load(
    new URL("./door/color.jpg", import.meta.url).href
  );
  const doorAlphaTexture = textureLoader.load(
    new URL("./door/alpha.jpg", import.meta.url).href
  );
  const doorAmbientOcclusionTexture = textureLoader.load(
    new URL("./door/ambientOcclusion.jpg", import.meta.url).href
  );
  const doorHeightTexture = textureLoader.load(
    new URL("./door/height.jpg", import.meta.url).href
  );
  const doorNormalTexture = textureLoader.load(
    new URL("./door/normal.jpg", import.meta.url).href
  );
  const doorMetalnessTexture = textureLoader.load(
    new URL("./door/metalness.jpg", import.meta.url).href
  );
  const doorRoughnessTexture = textureLoader.load(
    new URL("./door/roughness.jpg", import.meta.url).href
  );

  doorColorTexture.colorSpace = THREE.SRGBColorSpace;
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientOcclusionTexture,
      displacementMap: doorHeightTexture,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
      transparent: true,
      displacementScale: 0.15,
      displacementBias: -0.04,
    })
  );

  door.position.y = 1;
  door.position.z = 2 + 0.01;
  group.add(door);

  // Door light
  const doorLight = new THREE.PointLight("#ff7d46", 2);
  doorLight.position.set(0, 2.2, 2.5);
  group.add(doorLight);
}

export function renderHouse(scene: THREE.Scene) {
  const house = new THREE.Group();
  scene.add(house);

  renderWall(house);
  renderRoof(house);
  renderDoor(house);
}
