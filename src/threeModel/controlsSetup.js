import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 设置控制器
export default function setupControls(camera, renderer) {
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.enableZoom = true;
  orbitControls.target.set(0, 5, 0);

  return orbitControls;
}
