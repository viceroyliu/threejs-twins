// pcdLoader.js

import * as THREE from 'three';
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { scene } from './sceneSetup';

const glasstexture = new THREE.TextureLoader().load('textures/glass.jpg');

let group = new THREE.Group();

const wall = new FBXLoader();
wall.load('models/fbx/wall.fbx',
    obj => {
      obj.name = "wall1"
      obj.scale.set(0.01, 0.01, 0.011)
      obj.position.set(-2, -2.5, 0)
      obj.castShadow = true
      obj.receiveShadow = true

      obj.children[0].material = new THREE.MeshPhongMaterial({
        map: glasstexture,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
        shininess: 10,
      })

      obj.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material.map = glasstexture;
          child.material.transparent = true;
          child.material.alphaTest = 0.4;
          child.material.depthWrite = true;
        }
      });

      group.name = "wall"
      group.add(obj)
      scene.add(group)
    }
);

// PCD点云加载...
const pcdloader = new PCDLoader();
pcdloader.load(
    'pcddemo/jiqi.pcd',
    function (points) {
      points.name  = 'cloud'
      // console.log(points);
      //缩放
      points.scale.set(0.4, 0.4, 0.3)
      //旋转
      points.rotation.x = -Math.PI / 2
      // points.rotation.y = Math.PI/2
      points.rotation.z = Math.PI / 2
      //位置
      points.position.set(21.2, 8.5, 13.5)
      // 模型点位大小
      points.material.size = 0.0002;

      points.castShadow = true;
      points.receiveShadow = true;
      points.material.color = new THREE.Color(0x00ffff); // 模型颜色

      // points.material.vertexColors = true ;
      // points.attributes.color  = new THREE.BufferAttribute(colors, 3);

      scene.add(points);

      // 构造盒子
      let middle = new THREE.Vector3();
      points.geometry.computeBoundingBox();
      points.geometry.boundingBox.getCenter(middle);

      points.applyMatrix4(
          new THREE.Matrix4().makeTranslation(
              -middle.x,
              -middle.y,
              -middle.z
          )
      );

      // 比例
      let largestDimension = Math.max(
          points.geometry.boundingBox.max.x,
          points.geometry.boundingBox.max.y,
          points.geometry.boundingBox.max.z
      );
    })
