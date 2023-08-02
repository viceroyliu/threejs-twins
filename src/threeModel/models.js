// models.js

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from './sceneSetup';
let texLoader = new THREE.TextureLoader()

// const smallMaterial = new THREE.MeshStandardMaterial({
//   metalness: 1.0,
//   roughness: 0.9,
//   roughnessMap: texLoader.load("textures/cucaodu.jpg"),
//   metalnessMap: texLoader.load("textures/jinshudu.jpg"),
// });

let smallMaterial = new THREE.MeshStandardMaterial({
  color: 0x969696,
  roughness: 0.9,
  metalness: 1.0,
})

const small3 = new FBXLoader();
small3.load('models/fbx/small.fbx',
    obj => {
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(0, 5.35, -13.57)
      obj.castShadow = true
      obj.receiveShadow = true

      obj.traverse(function (child) {
        if (child.isMesh) {
          child.material = smallMaterial
        }
      })

      scene.add(obj);
    }
);

const rail1 = new FBXLoader();
rail1.load('models/fbx/rail.fbx',
    obj => {
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(4.5, 4.9, -18)
      obj.castShadow = true
      obj.receiveShadow = true

      obj.material = new THREE.MeshPhysicalMaterial({
        metalness: 1.0,
        roughness: 0.9,
        roughnessMap: texLoader.load("textures/cucaodu.jpg"),
        metalnessMap: texLoader.load("textures/jinshudu.jpg"),
      })

      scene.add(obj);
    }
);

const rail2 = new FBXLoader();
rail2.load('models/fbx/rail.fbx',
    obj => {
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(-8, 4.9, -18)
      obj.castShadow = true
      obj.receiveShadow = true

      obj.material = new THREE.MeshPhysicalMaterial({
        metalness: 1.0,
        roughness: 0.9,
        roughnessMap: texLoader.load("textures/cucaodu.jpg"),
        metalnessMap: texLoader.load("textures/jinshudu.jpg"),
      })

      scene.add(obj);
    }
);

const cangqu = new FBXLoader();
cangqu.load('models/fbx/cangqu.fbx',
    obj => {
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(-2.5, -2.5, -13.5)
      obj.castShadow = true
      obj.receiveShadow = true
      obj.name = "cang"

      scene.add(obj);
    }
);
