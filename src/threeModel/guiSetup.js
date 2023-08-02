import * as dat from 'dat.gui';

// 设置GUI
export default function setupGUI(scene, camera) {
  class PositionGUI {
    constructor(obj, name) {
      this.obj = obj;
      this.name = name;
    }
    get modify() {
      return this.obj[this.name];
    }
    set modify(v) {
      this.obj[this.name] = v;
    }
  }

  function defaultCamera() {
    camera.position.set(25, 20, 12);
    camera.updateProjectionMatrix();
  }

  let disObj = {
    visible: true,
    move: 0
  };

  const gui = new dat.GUI({ width:200 });
  const folder = gui.addFolder('修改视角');
  ['x', 'y', 'z'].forEach(dim => {
    folder.add(new PositionGUI(camera.position, dim), 'modify', 0, 200).name(dim);
  });
  folder.add(camera, 'updateMatrix').onChange(defaultCamera).name('恢复默认视角');
  folder.open();

  return gui;
}
