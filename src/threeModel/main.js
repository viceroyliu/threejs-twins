// main.js

import * as THREE from 'three';
import {scene, renderer, camera, orbitControls} from './sceneSetup';
import {mqttServerFun} from './mqttServer';
import './models';
import './pcdLoader';
import './gui.js';

function init() {
  const connectUrl = 'ws://127.0.0.1:8083/mqtt';
  const topic = ['hangche1', 'hangche2'];
  mqttServerFun(connectUrl,topic);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.append(renderer.domElement);

  function render() {
    requestAnimationFrame(render)
    orbitControls.update()
    renderer.render(scene, camera)
  }
  render();
}

init();
