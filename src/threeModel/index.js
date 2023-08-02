import * as THREE from 'three';
import setupLighting from './lightSetup';
import setupCamera from './cameraSetup';
import setupRenderer from './rendererSetup';
import setupControls from './controlsSetup';
import setupResizeHandler from './resizeHandler';
import setupGUI from './guiSetup';
import setupMqtt from './mqttClient';

const scene = new THREE.Scene();
setupLighting(scene);
const camera = setupCamera(window.innerWidth, window.innerHeight);
const renderer = setupRenderer();
const controls = setupControls(camera, renderer);
setupResizeHandler(camera, renderer);
const gui = setupGUI(scene, camera);
const mqttServer = setupMqtt(scene);

function tick() {
  requestAnimationFrame(tick);
  controls.update();
  renderer.render(scene, camera);
}
tick();

export default renderer;
