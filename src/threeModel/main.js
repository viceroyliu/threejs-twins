// main.js

import * as THREE from 'three';
import {scene, renderer, camera, orbitControls} from './sceneSetup';
import {initStompData} from './stompServer';
import './models';
import './pcdLoader';
import './gui.js';

export function render() {
  orbitControls.update();
  requestAnimationFrame(render)  // requestAnimationFrame默认调用render函数60次，通过时间判断，降低renderer.render执行频率
  renderer.render(scene, camera);
}

function init() {
  // const connectUrl = 'ws://47.105.44.218/ws'; // dev环境
  const connectUrl = 'ws://192.168.8.8:8000/ws'; // prod环境
  // 'car1','car1-1'
  const topics = [
    {
      topicUrl: 'jtgx/crane/position/front/1',
      bigCarName: 'car1',
      littleCarName: 'car1-1'
    },
    {
      topicUrl: 'jtgx/crane/position/front/2',
      bigCarName: 'car2',
      littleCarName: 'car2-1'
    }
  ];
  initStompData(connectUrl, topics);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.append(renderer.domElement);
  render();
}

init();
