import { Injectable } from '@angular/core';
import { SCENE, CAMERA } from '../config/base';
import { SkeletonHelper, AnimationMixer, Clock } from 'three';
import { GLTFLoader } from 'three-full';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FactoryService {

  oldData;  //  定义一个旧的高度值，用于和新的高度值做比较
  thing;
  addmodul() {
    const loader = new GLTFLoader();
    loader.load('assets/model/people/jx.glb', (gltf) => {
      console.log(gltf);

      this.thing = gltf.scene;
      SCENE.add(this.thing);
      this.thing.visible = false;   // 用visible来控制模型的显示隐藏，这这个对性能比较好。
    },
      undefined,
      (error) => {
        console.error(error);
      });
  }



  getmousewheel(e: number) {
    const $a = of(e).pipe(filter((r: number) => r !== this.oldData));
    $a.subscribe(r => {
      // console.log(r);
      if (r < this.oldData) {   //  放大
        if (this.thing) {
          if (r < 8) {
            this.thing.visible = true;
          }
        }
      }
      if (r > this.oldData) {   //  缩小
        if (this.thing) {
          if (r > 8) {
            this.thing.visible = false;
          }
        }
      }
      this.oldData = r;
    })
      .unsubscribe();


  }
}

