import { Injectable } from '@angular/core';
import { SCENE } from '../config/base';
import { GLTFLoader, CSS3DObject } from 'three-full';
@Injectable({
  providedIn: 'root'
})
export class GlassService {

  constructor() { }

  addGlass() {

    const loader = new GLTFLoader();
    loader.load('assets/model/flipper.glb', (gltf) => {

      console.log(gltf);

      // 把模型添加到场景中，SCENE是从base.ts导入的
      SCENE.add(gltf.scene);
      this.addCss(gltf.scene);


    },
      undefined,
      (error) => {
        console.error(error);
      });
  }

  addCss(scene) {
    const div = document.createElement('div');
    div.style.width = '160px';
    div.style.height = '160px';
    div.style.backgroundColor = '#000';
    const iframe = document.createElement('iframe');
    iframe.style.width = '160px';
    iframe.style.height = '160px';
    iframe.style.border = '0px';
    iframe.src = ['https://www.baidu.com/'].join('');
    div.appendChild(iframe);

    const object = new CSS3DObject(div);
    object.position.set(0, 30, 0);
    object.scale.set(0.1, 0.1, 0.1);
    scene.add(object);
    console.log(object);


  }

}
