import * as THREE from 'three';

// 设置光源
export default function setupLighting(scene) {
  const light1 = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(light1);

  const lightPositions = [
    [60, 30, 0],
    [-60, -30, 0],
    [0, 30, 60],
    [0, -30, -60],
    [0, 80, 0],
  ];

  for (let pos of lightPositions) {
    let light = new THREE.SpotLight(0xffffff, 0.5);
    light.position.set(...pos);
    scene.add(light);
  }
}
