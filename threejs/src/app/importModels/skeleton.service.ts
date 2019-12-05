import { Injectable } from '@angular/core';
import { SkeletonHelper, AnimationMixer, Clock, AnimationAction, LoopPingPong, Scene } from 'three';
import { SCENE, MIX } from '../config/base';
import { GLTFLoader } from 'three-full';
import { WebSocketService } from '../shared/web-socket.service';
import { filter } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SkeletonService {
  action: AnimationAction;  // 动画动作
  oldData = 0;  //  定义一个旧值;
  gltf;
  constructor(public webSocketService: WebSocketService, ) {
  }

  /**
   * @ name 控制动画开始和暂停
   * @ param e 回调开关
   */
  isPlay(e: boolean) {
    this.action.paused = e;
  }

  addSkeleton() {
    let mixer;

    const loader = new GLTFLoader();
    loader.load('assets/model/people/jx1.glb', (gltf) => {

      console.log(gltf);
      this.gltf = gltf.scene;
      // 把模型添加到场景中，SCENE是从base.ts导入的
      SCENE.add(this.gltf);

      // 显示模型骨架
      const skeletonHelper = new SkeletonHelper(gltf.scene);
      skeletonHelper.material['linewidth'.toString()] = 2;
      SCENE.add(skeletonHelper);

      // 调用模型动画
      mixer = new AnimationMixer(gltf.scene);
      this.action = mixer.clipAction(gltf.animations[1]);

      this.action.stop();
      this.action.play();
      MIX.push(mixer);

      // const actions = []; //  所有的动画数组
      // for (let i = 0; i < gltf.animations.length; i++) {
      //   actions[i] = mixer.clipAction(gltf.animations[i]);
      // }

      // // 连接websocket
      // this.webSocketService.connect('ws://192.168.200.212:8080/');
      // // 接收消息
      // this.webSocketService.messageSubject.subscribe(
      //   data => {
      //     const $data = of(data).pipe(filter((r: number) => r !== this.oldData));
      //     $data.subscribe(d => {
      //       console.log(d);

      //       for (let j = 0; j < actions.length; j++) {
      //         if (j === (data - 1)) {
      //           actions[j].play();
      //         } else {
      //           actions[j].stop();
      //         }
      //       }
      //       MIX.splice(0, MIX.length);
      //       MIX.push(mixer);
      //       this.oldData = d;
      //     })
      //       .unsubscribe();
      //     console.log(data);

      //   },
      //   err => console.log(err)
      // );



      //  监听单个动画结束回调
      // mixer.addEventListener('loop', (e) => {
      //   console.log(e);
      //   console.log('结束');

      // });
    },
      undefined,
      (error) => {
        console.error(error);
      });
  }



  getTime(e: number) {
    const $a = of(e).pipe(filter((r: number) => r > 1.25));
    $a.subscribe(r => {
      console.log(r);
      return 0;

    })
      .unsubscribe();
  }



}
