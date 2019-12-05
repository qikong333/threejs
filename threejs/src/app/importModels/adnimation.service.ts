import { Injectable } from '@angular/core';
import { SCENE } from '../config/base';
import { SkeletonHelper, AnimationMixer } from 'three';
import { GLTFLoader } from 'three-full';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BoxService } from './box.service';
import { EventService } from '../service/event.service';
@Injectable({
  providedIn: 'root'
})
export class AdnimationService {
  actions = []; //  所有的动画数组
  MIX = [];
  constructor(
    // private box: BoxService,
    private event: EventService,
  ) {
    this.event.subscribe('boxStop', r => {
      this.changeAdnimation(r);
    });
  }

  addModel() {
    let mixer;

    const loader = new GLTFLoader();
    loader.load('assets/model/people/box.glb', (gltf) => {

      console.log(gltf);

      SCENE.add(gltf.scene);

      // 调用模型动画
      mixer = new AnimationMixer(gltf.scene);

      for (let i = 0; i < gltf.animations.length; i++) {
        this.actions[i] = mixer.clipAction(gltf.animations[i]);
        this.actions[i].stop();
        console.log(this.actions[i].getEffectiveTimeScale());
        this.MIX.push(mixer);
      }

      this.actions[0].play();


      //  监听单个动画结束回调
      mixer.addEventListener('loop', (e) => {
        console.log(e);


        // this.stop();
        if (e.action._clip.name === 'action1') {
          // console.log('box0结束1');
          this.event.set('adnimationStop', 1);
        }
        if (e.action._clip.name === 'CubeAction.002') {
          // console.log('box0结束2');
          this.event.set('adnimationStop', 2);
        }
        if (e.action._clip.name === 'CubeAction.001') {
          // console.log('box0结束3');
          this.event.set('adnimationStop', 3);
          this.actions.map(r => r.reset());
        }

      });
    },
      undefined,
      (error) => {
        console.error(error);
      });
  }
  getTime(time: number) {
    // console.log(time);
    const $a = of(time).pipe(filter((r: number) => r > 4));
    return $a;
  }

  stop() {
    this.actions.map(r => {
      r.paused = true;
    });
  }

  play() {
    this.actions.map(r => {
      r.paused = false;
    });
  }

  mix() {
    return this.MIX;
  }

  /**
   * @param name 动画名字
   */
  changeAdnimation(n) {
    console.log(n);
    for (let i = 0; i < this.actions.length; i++) {
      const element = this.actions[i];
      if (n === i) {
        element.play();
      } else {
        element.stop();
      }

    }

    // this.actions.map(r => {
    //   r.stop();
    // });
    // this.actions[n].play();
    // this.actions[0].play();
    // this.play();
  }

}
