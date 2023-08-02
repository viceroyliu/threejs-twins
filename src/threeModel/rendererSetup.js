import * as THREE from 'three';

// 设置渲染器
export default function setupRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  return renderer;
}
