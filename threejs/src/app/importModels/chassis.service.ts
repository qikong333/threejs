import { Injectable } from '@angular/core';
import { SCENE } from '../config/base';
import { GLTFLoader } from 'three-full';
import { Group, MeshBasicMaterial } from 'three';
import * as TWEEN from '@tweenjs/tween.js';
@Injectable({
  providedIn: 'root'
})
export class ChassisService {

  constructor() { }

  box() {
    const boxGroup = new Group();
    boxGroup.name = 'boxGroup';
    //  机箱
    const loader = new GLTFLoader();
    loader.load('assets/model/box/a1_guizi.gltf', (gltf) => {
      console.log(gltf);
      gltf.scene.name = 'chassis';
      boxGroup.add(gltf.scene);
    },
      undefined,
      (error) => {
        console.error(error);
      });

    //  服务器
    loader.load('assets/model/serverBox/fuwuqi.gltf', (gltf) => {
      console.log(gltf);
      gltf.scene.translateX(1);
      gltf.scene.rotation.set(0, 1.50 * Math.PI, 0);
      gltf.scene.position.set(0, 1.75, 0);
      gltf.scene.name = 'service';
      boxGroup.add(gltf.scene);
    },
      undefined,
      (error) => {
        console.error(error);
      });

    // 门
    loader.load('assets/model/d/door-1.gltf', (gltf) => {
      console.log(gltf);
      gltf.scene.position.set(-0.3, 0, -0.5);
      gltf.scene.traverse((child) => {  // 遍历判断Mesh
        if (child.isMesh) {
          child.translateY(-0.5);
          child.translateX(-0.3);
        }
      });
      boxGroup.add(gltf.scene);
      gltf.scene.name = 'door';
      SCENE.add(boxGroup);
    },
      undefined,
      (error) => {
        console.error(error);
      });
  }


  doorActive(target) {
    if (target && target.parent.name === 'door') {
      const tmp = target.parent.rotation.clone();
      new TWEEN.Tween(tmp)
        .to({ x: 0, y: 0.80 * Math.PI, z: 0 }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((obj) => {
          target.parent.rotation.set(obj.x, obj.y, obj.z);
        })
        .start();
    }
  }

  fuwuqiActive(target, num?) {
    if (target && target.name === 'fwq') {  // 触发对象
      //  递归获取对象
      const getParent = (obj) => {
        if (obj && obj.name !== 'boxGroup') {   //  受影响群组（必须是触发对象的父级）
          return getParent(obj.parent);
        } else {
          console.log(obj);
          return obj;
        }
      };

      const g = getParent(target);
      g.traverse((child) => {  // 遍历判断Mesh
        if (child.isMesh) {
          console.log(child);
          if (child.name !== 'fwq') {     //  排除影响对象
            // 事件处理
            if (num === 0) {  //  透明
              if (!child.material.length) {
                child.material.transparent = true;
                child.material.opacity = 0.3;
              } else {
                child.material.map(r => {
                  r.transparent = true;
                  r.opacity = 0.3;
                });
              }
            } else {  // 回复
              if (!child.material.length) {
                child.material.transparent = false;
              } else {
                child.material.map(r => {
                  r.transparent = false;
                });
              }

            }

          }
        }
      });

    }





  }

}





