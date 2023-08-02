import * as THREE from 'three';

// 设置摄像机
export default function setupCamera(w, h) {
  const camera = new THREE.PerspectiveCamera(
      50,   //fov
      w / h,   //aspect
      1,    //near
      500   //far
  );
  camera.position.set(25, 20, 12);
  camera.position.y += 1;
  camera.translateZ(1);

  return camera;
}
