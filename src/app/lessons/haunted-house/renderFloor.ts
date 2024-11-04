import * as THREE from "three";
import GUI from "lil-gui";
// // @ts-ignore
// import * as TiffDecoder from "tiff-decoder/index";

// console.log(TiffDecoder);

// function loadTiffTexture(url: string) {
//   return fetch(url)
//     .then((response) => response.arrayBuffer())
//     .then((buffer) => {
//       const decoder = new TiffDecoder(buffer);
//       const image = decoder.getImage();
//       const canvas = document.createElement("canvas");
//       canvas.width = image.width;
//       canvas.height = image.height;
//       const context = canvas.getContext("2d");
//       const imageData = context!.createImageData(image.width, image.height);
//       imageData.data.set(new Uint8ClampedArray(image.data));
//       context!.putImageData(imageData, 0, 0);

//       const texture = new THREE.Texture(canvas);
//       texture.needsUpdate = true;
//       return texture;
//     });
// }

export async function renderFloor(scene: THREE.Scene) {
  const alphaTexture = new THREE.TextureLoader().load(
    new URL("./floor/alpha.jpg", import.meta.url).href
  );

  const colorTexture = new THREE.TextureLoader().load(
    new URL(
      "./floor/grass/Poliigon_GrassPatchyGround_4585_BaseColor.jpg",
      import.meta.url
    ).href
  );
  const normalTexture = new THREE.TextureLoader().load(
    new URL(
      "./floor/grass/Poliigon_GrassPatchyGround_4585_Normal.png",
      import.meta.url
    ).href
  );
  const roughnessTexture = new THREE.TextureLoader().load(
    new URL(
      "./floor/grass/Poliigon_GrassPatchyGround_4585_Roughness.jpg",
      import.meta.url
    ).href
  );
  const metalnessTexture = new THREE.TextureLoader().load(
    new URL(
      "./floor/grass/Poliigon_GrassPatchyGround_4585_Metallic.jpg",
      import.meta.url
    ).href
  );

  const displacementTexture = new THREE.TextureLoader().load(
    new URL(
      "./floor/grass/Poliigon_GrassPatchyGround_4585_Displacement.jpg",
      import.meta.url
    ).href
  );

  colorTexture.repeat.set(8, 8);
  normalTexture.repeat.set(8, 8);
  displacementTexture.repeat.set(8, 8);

  colorTexture.wrapS = THREE.RepeatWrapping;
  colorTexture.wrapT = THREE.RepeatWrapping;

  normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;

  displacementTexture.wrapS = THREE.RepeatWrapping;
  displacementTexture.wrapT = THREE.RepeatWrapping;

  colorTexture.colorSpace = THREE.SRGBColorSpace;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
      alphaMap: alphaTexture,
      transparent: true,
      map: colorTexture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      metalnessMap: metalnessTexture,
      displacementMap: displacementTexture,
      displacementScale: 0.06,
      displacementBias: 0.003,
    })
  );

  const gui = new GUI();
  gui
    .add(floor.material, "displacementScale")
    .min(0)
    .max(1)
    .step(0.001)
    .name("floorDisplacementScale");
  gui
    .add(floor.material, "displacementBias")
    .min(-1)
    .max(1)
    .step(0.001)
    .name("floorDisplacementBias");

  floor.rotation.x = -Math.PI / 2;

  floor.receiveShadow = true;
  scene.add(floor);
}
