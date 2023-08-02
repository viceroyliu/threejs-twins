// GUI
import * as dat from "dat.gui";
import {camera, scene} from "./sceneSetup.js";

const gui = new dat.GUI({ width:200 })
// gui.hide()
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

function defaultCamera() {
  camera.position.set(25, 20, 12)
  camera.updateProjectionMatrix()
}

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
tips.open()
