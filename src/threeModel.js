import * as THREE from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/dracoloader'
import { Loader } from 'three'


// import { defineConfig } from "vite";
// import optimizer from "vite-plugin-optimizer";
// let getReplacer = () => {
//   let externalModels = ["mqtt","os", "fs", "path", "events",];
//   let result = {};
//   for (let item of externalModels) {
//     result[item] = () => ({
//       find: new RegExp(`^${item}$`),
//       code: `const ${item} = require('${item}');export { ${item} as default }`,
//     });
//   }
//   return result;
// };
// export default defineConfig({
//   plugins: [optimizer(getReplacer())],
// });

//MQTT
import * as mqtt from "mqtt/dist/mqtt.min";
class MqttApi {
  client = null;
  constructor(connectUrl, topic) {
    const options = {
      keepalive: 40, // 默认60秒，设置0为禁用
      clean: true, // 设置为false以在脱机时接收QoS 1和2消息
      // connectTimeout: 4000,
      clientId: 'mqttjs_clientid',
      username: "guest",
      password: 'guest',
      protocolId: 'MQTT',
      protocolVersion: 4,
      // protocolId: 'MQIsdp', // 只支持MQTT 3.1(不符合3.1.1)的代理
      // protocolVersion: 3,   // 版本
      reconnectPeriod: 1000, //设置多长时间进行重新连接 单位毫秒 两次重新连接之间的时间间隔。通过将设置为，禁用自动重新连接0
      connectTimeout: 10 * 1000, // 收到CONNACK之前等待的时间
    }
    this.client = mqtt.connect(connectUrl, options);
    this.client.on("connect", (connack) => {
      console.log('链接成功')
      if (topic) {
        this.client.subscribe(topic, (err) => {
          if (!err) {
            console.log('订阅成功')
          }
        })
      }
    });
    this.client.on('reconnect', () => {
      console.log("正在重连.....");
    });
    this.client.on("close", function(error) {
      if(error){
        // console.log(error)
      }else{
        console.log("客户端已断开.....");
      }

    });
    this.client.on("offline", function() {

    });
    //当客户端无法连接或出现错误时触发回调
    this.client.on("error", (error) => {
      console.log("客户端出现错误....." + error);
    });
    this.client.on("packetsend", (packet) => {
      if (packet && packet.payload) {
        console.log("客户端已发出数据包....." + packet.payload);
      }
    });
  }
  // 断开链接
  disconnect() {
    try {
      if (this.client && this.client.connected) {
        this.client.end();
      }
    } catch (error) {
      console.log(error)
    }

  }
  // 重新链接
  reconnect() {
    this.client.reconnect()
  }
  // 关闭
  close() {
    try {
      if (this.client && this.client.connected) {
        this.client.end();
        this.client = null;
      }
    } catch (error) {
      console.log(error)
    }
  }
  // 发布消息
  publish(topic, message) {
    if (this.client && this.client.connected) {
      this.client.publish(topic, message, { qos: 0, retain: true }, (error) => {
        if (error) {
          console.log(error)
        } else {
          console.log('发布消息成功')
        }
      })
    }
  }
  // 订阅主题
  subscribe(topic) {
    if (this.client && this.client.connected) {
      this.client.subscribe(topic, { qos: 0 }, function(error, granted) {
        if (error) {
          console.log(error)
        } else {
          console.log(`${granted[0].topic} 订阅成功`)
        }
      })
    }
  }
  // 取消订阅
  unsubscribe(topic) {
    if (this.client && this.client.connected) {
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          console.log(error)
        } else {
          console.log('取消订阅成功')
        }
      })
    }
  }
}





// 其他方法
// 断开链接
// mqttServer.disconnect();
// 重新链接
// mqttServer.reconnect()
// 关闭链接
// mqttServer.close();
// 订阅主题
// mqttServer.subscribe('主题')


//场景
const scene = new THREE.Scene()
scene.background = new THREE.CubeTextureLoader()
    .setPath('textures/cube/')
    .load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']
    );

const stat = new Stat()

//辅助坐标
// const axes = new THREE.AxesHelper(5, 5, 5)
// scene.add(axes)

//ground
let mesh = new THREE.Mesh(new THREE.PlaneGeometry(80, 90), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh.rotation.x = - Math.PI / 2;
mesh.position.set(0, -2.5, 0)
mesh.receiveShadow = true;
scene.add(mesh);

//地面网格线
// let grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
// grid.material.opacity = 0.2;
// grid.material.transparent = true;
// scene.add( grid );



import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader'
import { KTXLoader } from 'three/examples/jsm/loaders/KTXLoader'

let texLoader = new THREE.TextureLoader()

// //新建纹理
// let texture = new THREE.TextureLoader().load( "textures/1.png" );
//         texture.encoding = THREE.sRGBEncoding;
//         texture.flipY = false;
//         texture.needsUpdate = true;
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
// //新建材质
// let tmaterial = new THREE.MeshStandardMaterial({ map: texture });
// let mCubeMap

// mCubeMap = new THREE.CubeTextureLoader()
//     .setPath( 'textures/cube2/' )
//     .load( [
// 		'posx.jpg',
// 		'negx.jpg',
// 		'posy.jpg',
// 		'negy.jpg',
// 		'posz.jpg',
// 		'negz.jpg'
// 	] );
// mCubeMap.format = THREE.RGBAFormat
// mCubeMap.mapping = THREE.CubeReflectionMapping

// model
// obj => {}   相当于 function(object){}
const big1 = new FBXLoader();
big1.load('models/fbx/big.fbx',
    obj => {
      obj.name = 'car1'
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(0, 5, 12)
      obj.castShadow = true
      obj.receiveShadow = true

      // obj.children[0].material = tmaterial

      obj.material = new THREE.MeshStandardMaterial({

        // envMap: mCubeMap,
        // color:0xD9D919,
        // 颜色贴图
        // map: texLoader.load("textures/jinshudu.jpg"),

        // 如果设置了emissiveMap，自发光贴图，请务必将发光颜色设置为黑色以外的其他颜色
        // emissive默认黑色，设置为白色
        // emissive:0xffffff,
        // 发光贴图
        // emissiveMap: texLoader.load("textures/jinshudu.jpg"),
        // 法线贴图
        // normalMap: texLoader.load("textures/jinshudu.jpg"),
        // 材质像金属的程度
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        metalness: 1.0,
        // 金属度贴图
        // metalnessMap: texLoader.load("textures/jinshudu.jpg"),
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        roughness: 0.9,
        // 粗糙度贴图
        // roughnessMap: texLoader.load("textures/cucaodu.jpg"),

        // transparent: true
      })

      obj.children[0].material.needsUpdate = true;

      // obj.traverse(function (child) {
      //     child.castShadow = true
      //     child.receiveShadow = true
      // });


      scene.add(obj);

      // console.log(obj);
    });


const small1 = new FBXLoader();
small1.load('models/fbx/small.fbx',
    obj => {
      obj.name = 'car1-1'
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(0, 5.35, 12.43)
      obj.castShadow = true
      obj.receiveShadow = true

      obj.material = new THREE.MeshPhysicalMaterial({
        // color:0xff0000,
        // 材质像金属的程度
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        metalness: 1.0,
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        roughness: 0.9,
        // 粗糙度贴图
        roughnessMap: texLoader.load("textures/cucaodu.jpg"),
        // 金属度贴图
        metalnessMap: texLoader.load("textures/jinshudu.jpg"),
      })

      // obj.traverse(function (child) {
      //     child.castShadow = true
      //     child.receiveShadow = true
      // });

      scene.add(obj);

      // console.log(obj);
    });


const big2 = new FBXLoader();
big2.load('models/fbx/big.fbx',
    obj => {
      obj.name = 'car2'
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(0, 5, 0)
      obj.castShadow = true
      obj.receiveShadow = true

      obj.material = new THREE.MeshPhysicalMaterial({
        // color:0xff0000,
        // 材质像金属的程度
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        metalness: 1.0,
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        roughness: 0.9,
        // 粗糙度贴图
        roughnessMap: texLoader.load("textures/cucaodu.jpg"),
        // 金属度贴图
        metalnessMap: texLoader.load("textures/jinshudu.jpg"),
      })

      scene.add(obj);

      // console.log(obj);
    });

const small2 = new FBXLoader();
small2.load('models/fbx/small.fbx',
    obj => {
      obj.name = 'car2-1'
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(0, 5.35, 0.43)
      obj.castShadow = true
      obj.receiveShadow = true

      obj.material = new THREE.MeshPhysicalMaterial({
        // color:0xff0000,
        // 材质像金属的程度
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        metalness: 1.0,
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        roughness: 0.9,
        // 粗糙度贴图
        roughnessMap: texLoader.load("textures/cucaodu.jpg"),
        // 金属度贴图
        metalnessMap: texLoader.load("textures/jinshudu.jpg"),
      })

      scene.add(obj);

      // console.log(obj);
    });



const big3 = new FBXLoader();
big3.load('models/fbx/big.fbx',
    obj => {
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(0, 5, -14)
      obj.castShadow = true
      obj.receiveShadow = true

      obj.children[0].material = new THREE.MeshPhysicalMaterial({
        // 颜色
        // color:0xff0000,


        //dev
        // 物体表面光泽度
        // shininess : 200,
        // 纹理贴图
        // map : new THREE.TextureLoader().load("textures/jinshudu.jpg"),
        // 粗糙度贴图
        // roughnessMap: new THREE.TextureLoader().load("textures/cucaodu2.png"),
        // 法线贴图
        // normalMap : new THREE.TextureLoader().load("textures/faxian.png"),
        // 位移贴图(高度贴图)
        // displacementMap : new THREE.TextureLoader().load("textures/height.png"),
        // 环境光遮罩(暗处更暗)
        // aoMap : new THREE.TextureLoader().load("textures/ao.png"),


        //release
        // 材质像金属的程度
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        metalness: 1.0,
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        roughness: 0.9,
        // 粗糙度贴图
        roughnessMap: texLoader.load("textures/cucaodu.jpg"),
        // 金属度贴图
        metalnessMap: texLoader.load("textures/jinshudu.jpg"),
      })

      scene.add(obj);

      // console.log(obj);
    });



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

      // obj.children[0].material = new THREE.MeshPhysicalMaterial({
      //     // color:0xff0000,
      //     // 材质像金属的程度
      //     // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
      //     metalness : 1.0,
      //     // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
      //     roughness : 0.9,
      //     // 粗糙度贴图
      //     roughnessMap: texLoader.load("textures/cucaodu.jpg"),
      //     // 金属度贴图
      //     metalnessMap: texLoader.load("textures/jinshudu.jpg"),
      // })
      obj.traverse(function (child) {
        if (child.isMesh) {
          child.material = smallMaterial
        }
      })

      scene.add(obj);

      // console.log(obj);
    });



const rail1 = new FBXLoader();
rail1.load('models/fbx/rail.fbx',
    obj => {
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(4.5, 4.9, -18)
      obj.castShadow = true
      obj.receiveShadow = true

      obj.material = new THREE.MeshPhysicalMaterial({
        // color:0xff0000,
        // 材质像金属的程度
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        metalness: 1.0,
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        roughness: 0.9,
        // 粗糙度贴图
        roughnessMap: texLoader.load("textures/cucaodu.jpg"),
        // 金属度贴图
        metalnessMap: texLoader.load("textures/jinshudu.jpg"),
      })

      scene.add(obj);

      // console.log(obj);
    });

const rail2 = new FBXLoader();
rail2.load('models/fbx/rail.fbx',
    obj => {
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(-8, 4.9, -18)
      obj.castShadow = true
      obj.receiveShadow = true

      obj.material = new THREE.MeshPhysicalMaterial({
        // color:0xff0000,
        // 材质像金属的程度
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        metalness: 1.0,
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        roughness: 0.9,
        // 粗糙度贴图
        roughnessMap: texLoader.load("textures/cucaodu.jpg"),
        // 金属度贴图
        metalnessMap: texLoader.load("textures/jinshudu.jpg"),
      })

      scene.add(obj);

      // console.log(obj);
    });


const cangqu = new FBXLoader();
cangqu.load('models/fbx/cangqu.fbx',
    obj => {
      obj.scale.set(0.01, 0.01, 0.01)
      obj.position.set(-2.5, -2.5, -13.5)
      obj.castShadow = true
      obj.receiveShadow = true
      obj.name = "cang"

      // obj.traverse(function (child) {
      //     child.castShadow = true
      //     child.receiveShadow = true
      // });

      scene.add(obj);

      // console.log(obj);
    });


//加载纹理贴图
let glasstexture = new THREE.TextureLoader().load('textures/glass.jpg');


let group = new THREE.Group()
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
        transparent: true,     //是否透明
        opacity: 0.4,//透明度
        side: THREE.DoubleSide,
        depthWrite: false,
        shininess: 10,


      })

      obj.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          //将贴图赋于材质
          child.material.map = glasstexture;
          //重点，没有该句会导致PNG无法正确显示透明效果
          child.material.transparent = true;
          child.material.alphaTest = 0.4;
          child.material.depthWrite = true;
        }
      });



      // scene.add(obj);
      // console.log(obj);
      group.name = "wall"
      group.add(obj)
      scene.add(group)
    });

//PCD点云
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js"; // 注意是examples/jsm
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

//Light
const light1 = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(light1)


//前
let directionalLight = new THREE.SpotLight(0xffffff, 0.5);
directionalLight.position.set(60, 30, 0);
scene.add(directionalLight);
// 后
let directionalLight2 = new THREE.SpotLight(0xffffff, 0.5);
directionalLight2.position.set(-60, -30, 0);
scene.add(directionalLight2);
// 左
let directionalLight3 = new THREE.SpotLight(0xffffff, 0.5);
directionalLight3.position.set(0, 30, 60);
scene.add(directionalLight3);
// 右
let directionalLight4 = new THREE.SpotLight(0xffffff, 0.5);
directionalLight4.position.set(0, -30, -60);
scene.add(directionalLight4);
// 上
let directionalLight5 = new THREE.SpotLight(0xffffff, 0.5);
directionalLight5.position.set(0, 80, 0);
scene.add(directionalLight5);





//Camera 透视摄像机
const w = window.innerWidth
const h = window.innerHeight

const camera = new THREE.PerspectiveCamera(
    50,      //fov
    w / h,   //aspect
    1,       //near
    500      //far
);
// camera.position.set(5,5,5)
camera.position.set(25, 20, 12)
camera.position.y  += 1
camera.translateZ(1)
// camera.lookAt(0, 10, 0)
// camera.lookAt(scene.position);

// const camerahelper = new THREE.CameraHelper(camera)
// scene.add(camerahelper)
// console.log(camera)


//Renderer
//抗锯齿
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
// 已挪到App.vue中设置尺寸
// renderer.setSize(w, h)
//告诉渲染器开启阴影投射
renderer.shadowMap.enabled = true;
// renderer.render(scene, camera)

// 已挪到App.vue中展示
// document.body.append(renderer.domElement)
// document.body.append(stat.dom)

//Control
// 摄像机轨道控制器
const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true
orbitControls.enableZoom = true
orbitControls.target.set( 0, 5, 0 );


//自适应浏览器大小
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);



//多个mesh 组合成group
// Create a group
// const group1 = new THREE.Group()
// group1.add(big1)
// group1.add(small1)
// console.log(group1)


//gui
import * as dat from 'dat.gui';

class PositionGUI {
  constructor(obj, name) {
    this.obj = obj
    this.name = name
  }
  get modify() {
    return this.obj[this.name]
  }
  set modify(v) {
    this.obj[this.name] = v
  }
}

// let wallDisplay = {
//     get Enabled() {
//        return wall.visible;
//      },
//    set Enabled(v) {
//        wall.visible = v;
//      }
// }


function defaultCamera() {
  camera.position.set(25, 20, 12)
  camera.updateProjectionMatrix()
}


const gui = new dat.GUI({ width:200 })
// gui.hide()


let disObj = new function() {
  this.visible = true
  this.move = 0
}


const folder = gui.addFolder('修改视角')
folder.add(new PositionGUI(camera.position, 'x'), 'modify', 0, 200).name('x')
folder.add(new PositionGUI(camera.position, 'y'), 'modify', 0, 200).name('y')
folder.add(new PositionGUI(camera.position, 'z'), 'modify', 0, 200).name('z')
folder.open()


folder.add(camera, 'updateMatrix').onChange(defaultCamera).name('恢复默认视角')


const displayObj = gui.addFolder('显示/隐藏')

displayObj.add(disObj, 'visible').name("墙壁").onChange(e => {
  scene.traverse(function(obj){
    if(obj.name === 'wall1'){
      obj.visible = !obj.visible
    }
  })
})
displayObj.add(disObj, 'visible').name("仓区").onChange(e => {
  scene.traverse(function(obj){
    if(obj.name === 'cang'){
      obj.visible = !obj.visible
    }
  })
})

displayObj.add(disObj, 'visible').name("点云").onChange(e => {
  scene.traverse(function(obj){
    if(obj.name === 'cloud'){
      obj.visible = !obj.visible
    }
  })
})

displayObj.add(disObj, 'visible').name("行车1").onChange(e => {
  scene.traverse(function(obj){
    if(obj.name === 'car1'){
      obj.visible = !obj.visible
    }
    if(obj.name === 'car1-1'){
      obj.visible = !obj.visible
    }
  })
})

displayObj.add(disObj, 'visible').name("行车2").onChange(e => {
  scene.traverse(function(obj){
    if(obj.name === 'car2'){
      obj.visible = !obj.visible
    }
    if(obj.name === 'car2-1'){
      obj.visible = !obj.visible
    }
  })
})


displayObj.open()

const moveObj = gui.addFolder('手动调试')
moveObj.add(disObj, 'move', -10, 15).name("行车1").onChange(e => {
  scene.traverse(function(obj){
    if(obj.name === 'car1'){
      obj.position.z = e
    }
    if(obj.name === 'car1-1'){
      obj.position.z = e+0.43
    }
  })
})

moveObj.add(disObj, 'move', -10, 15).name("行车2").onChange(e => {
  scene.traverse(function(obj){
    if(obj.name === 'car2'){
      obj.position.z = e
    }
    if(obj.name === 'car2-1'){
      obj.position.z = e +0.43
    }
  })
})

moveObj.add(disObj, 'move', -5, 5).name("小车1").onChange(e => {
  scene.traverse(function(obj){
    if(obj.name === 'car1-1'){
      obj.position.x = e

    }
  })
})

moveObj.add(disObj, 'move', -5, 5).name("小车2").onChange(e => {
  scene.traverse(function(obj){
    if(obj.name === 'car2-1'){
      obj.position.z = e
    }
  })
})

const tips = gui.addFolder('按H键隐藏')
// console.log(scene)

// scene.traverse(function(obj){
//     let len = obj.children.length;
//     obj.children.forEach(function(child, i){
//         console.log(child)
//     })

// if(obj.type === 'GridHelper'){
//     console.log(obj)
// }
// if(obj.type === 'Mesh'){
//     console.log(obj)
// }
// if(obj.type === 'Group'){
//     let len = obj.children.length;
//     obj.children.forEach(function(child, i){
//         child.position.y = -5 + Math.floor( 10 * (i / len) );
//         let s = 0.25 + 1.75 * (1 - i / len);
//         child.scale.set(s, s, s);
//     });

// }
// });

// let group1 = new THREE.Group()
// group1.add(big1)
// group1.add(small1)
// scene.add(group1)

// console.log(group1)


// 接收数据
const connectUrl = 'ws://127.0.0.1:8083/mqtt'  // 链接地址
const topic = ['hangche1', 'hangche2']    // 订阅的主题可以是字符串，多个为数组形式
const mqttServer = new MqttApi(connectUrl, topic);  // 初始化链接
// 获取消息的回调
mqttServer.client.on('message', (topic, message, packet) => {
  console.log('收到消息')
  // topic 主题
  // message 消息主体
  console.log(topic, message)
  console.log(message.toString())
  scene.traverse(function(obj){
    if(obj.name === 'car1'){
      obj.position.z = parseFloat(message)
    }
    if(obj.name === 'car1-1'){
      obj.position.z = parseFloat(message)+0.43
    }
  })
})

// 断开的回调
mqttServer.client.on("close", function(error) {
  if(!error){
    console.log("断开操作");
  }
});

const clock = new THREE.Clock()
function tick() {
  const time = clock.getElapsedTime()
  requestAnimationFrame(tick)

  orbitControls.update()
  renderer.render(scene, camera)

}
tick()


// scene.traverse(function(obj){
//     if(obj.type === 'Group'){
//         console.log(obj)
//     }
// });


export default renderer
