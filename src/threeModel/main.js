// main.js

import * as THREE from 'three';
import {scene, renderer, camera, orbitControls} from './sceneSetup';
import {mqttServerFun} from './mqttServer';
import {initStompData} from './stompServer';
import './models';
import './pcdLoader';
import './gui.js';

// let animationId = null; // 动画id

export function render() {
  orbitControls.update();
  requestAnimationFrame(render)  // requestAnimationFrame默认调用render函数60次，通过时间判断，降低renderer.render执行频率
  renderer.render(scene, camera);
}

function init() {
  const connectUrl = 'ws://127.0.0.1:8083/mqtt';
  const topic = ['hangche1', 'hangche2'];
  // mqttServerFun(connectUrl,topic);
  initStompData();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.append(renderer.domElement);
  render();
}

init();
