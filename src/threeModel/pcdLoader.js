// pcdLoader.js

import * as THREE from 'three';
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader.js";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {scene, camera} from './sceneSetup';
import {render} from "./main.js";

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
// id=要获取的雷达号，暂只支持所有all, voxel=点云精度，单位为cm
let pcdUrl = `http://192.168.1.100:8080/full_pointcloud?id=all&voxel=20`;
const pcdLoader = new PCDLoader();
let currentPCD = null;  // 用来存储加载的PCD对象
// 一分钟变动一次
setInterval(() => {
  changeURL(pcdUrl);
}, 1000 * 60)

function changeURL(newURL) {
  scene.remove(currentPCD);// 清除现有的点云数据
  loaderPcdFun(newURL); // 加载新的URL
}

loaderPcdFun(pcdUrl);

function loaderPcdFun(pcdUrl) {
  pcdLoader.load(
      pcdUrl,
      (points) => {
        // console.log(points)
        currentPCD = points;
        points.name = 'cloud'
        //缩放
        // points.scale.set(0.4, 0.4, 0.3)  // 原jiqi.pcd
        points.scale.set(0.00287, 0.0025, 0.003)
        //旋转
        points.rotation.x = -Math.PI / 2
        // points.rotation.y = Math.PI/2
        points.rotation.z = Math.PI / 2
        //位置
        // points.position.set(21.2, 8.5, 13.5) // 原jiqi.pcd
        // 模型点位大小
        points.material.size = 0.0002;

        points.castShadow = true;
        points.receiveShadow = true;
        // points.material.color = new THREE.Color(0x00ffff); // 原jiqi.pcd模型颜色

        // points.material.vertexColors = true ;
        // points.attributes.color  = new THREE.BufferAttribute(colors, 3);
        points.geometry.center();
        points.geometry.rotateX(Math.PI);
        points.position.set(-2.2, -1.9, 8);
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
        // camera.position.y = largestDimension;
        render();

        // console.log(largestDimension);
      }, (xhr) => {
        let load = xhr.loaded / xhr.total
        if (load === 1) {
          // console.log('pcd模型加载完成');
        }
      },
      (error) => {
        console.log(error);
      })
}
