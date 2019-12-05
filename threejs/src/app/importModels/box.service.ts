import { Injectable } from '@angular/core';
import { GLTFLoader, CSS3DObject } from 'three-full';
import { SCENE } from '../config/base';
import { AnimationMixer } from 'three';
import { Box1Service } from './box1.service';
import { AdnimationService } from './adnimation.service';
import { EventService } from '../service/event.service';
import { log } from 'util';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  box1;
  box2;
  box3;
  actions1 = []; //  所有的动画数组
  actions2 = []; //  所有的动画数组
  actions3 = []; //  所有的动画数组
  MIX = [];

  constructor(
    // public box0: AdnimationService,
    // private box0: Box1Service,
    private event: EventService,
  ) {

    this.event.subscribe('adnimationStop', r => {
      console.log(r);
      this.play(r);
    });
  }


  addModel() {
    let mixer1;
    let mixer2;
    let mixer3;

    const loader = new GLTFLoader();
    loader.load('assets/model/jxb/jxb2.glb', (gltf) => {
      console.log(11111111111111);
      console.log(gltf);

      this.box1 = gltf;
      this.box1.scene.position.set(-5, 0, 6);
      SCENE.add(this.box1.scene);

      // 调用模型动画
      mixer1 = new AnimationMixer(this.box1.scene);
      for (let i = 0; i < gltf.animations.length; i++) {
        this.actions1[i] = mixer1.clipAction(gltf.animations[i]);
        this.actions1[i].play();

        this.MIX.push(mixer1);
      }
      this.stop(1);

      //  监听单个动画结束回调
      mixer1.addEventListener('loop', (e) => {
        console.log('结束1');
        this.actions1.map(r => r.reset());
        this.stop(1);
        this.event.set('boxStop', 1);
        this.event.unsubscribe('adnimationStop', r => {
          console.log(r);

        });

      });
    });



    loader.load('assets/model/jxb/polish.glb', (gltf) => {

      this.box2 = gltf;
      this.box2.scene.position.set(0, 0, 6);
      SCENE.add(this.box2.scene);

      // 调用模型动画
      mixer2 = new AnimationMixer(this.box2.scene);

      for (let i = 0; i < gltf.animations.length; i++) {
        this.actions2[i] = mixer2.clipAction(gltf.animations[i]);
        this.actions2[i].play();
        this.MIX.push(mixer2);
      }
      this.stop(2);

      //  监听单个动画结束回调
      mixer2.addEventListener('loop', (e) => {
        console.log('结束2');
        this.actions2.map(r => r.reset());
        this.stop(2);
        this.event.set('boxStop', 2);
      });
    });




    loader.load('assets/model/jxb/zhongzhuan001.glb', (gltf) => {
      console.log(gltf);

      this.box3 = gltf;

      this.box3.scene.position.set(5, 0, 6);
      SCENE.add(this.box3.scene);
      this.addCss(this.box3.scene);
      // 调用模型动画
      mixer3 = new AnimationMixer(this.box3.scene);

      for (let i = 0; i < gltf.animations.length; i++) {
        this.actions3[i] = mixer3.clipAction(gltf.animations[i]);
        this.actions3[i].play();
        this.MIX.push(mixer3);
      }
      this.stop(3);

      //  监听单个动画结束回调
      mixer3.addEventListener('loop', (e) => {
        console.log('结束3');
        this.actions3.map(r => r.reset());
        this.stop(3);
        this.event.set('boxStop', 0);
      });
    });

    //  定义时间，这个必须要写在const render 的外面，因为render是不停刷新的如果写在里面会不停重置

    //  本模型的渲染事件可以分离到这里
    const render = () => {
      requestAnimationFrame(render);
      if (this.box3) {
        // this.box3.scene.position.x += 0.1;
        this.box3.scene.traverse((child) => {  // 遍历判断Mesh
          if (child.isMesh) {
            if (child.name === 'sole') {
              child.rotation.z += 0.01;
            }
            if (child.name === 'arm001') {
              child.rotation.y += 0.01;
            }

            if (child.name === 'arm-header001') {
              child.rotation.y += 0.005;
            }

          }
        });


      }

    };
    render();
  }

  mix() {
    return this.MIX;
  }

  stop(i?) {
    switch (i) {
      case 1:
        this.actions1.map(r => {
          r.paused = true;
        });
        break;
      case 2:
        this.actions2.map(r => {
          r.paused = true;
        });
        break;
      case 3:
        this.actions3.map(r => {
          r.paused = true;
        });
        break;

      default:
        console.log(11111111);

        break;
    }

  }

  play(i) {
    switch (i) {
      case 1:
        this.actions1.map(r => {
          r.paused = false;
        });
        break;
      case 2:
        this.actions2.map(r => {
          r.paused = false;
        });
        break;
      case 3:
        this.actions3.map(r => {
          r.paused = false;
        });
        break;

      default:
        break;
    }

  }

  addCss(scene) {
    const earthDiv = document.createElement('div');
    earthDiv.className = 'label';
    earthDiv.innerHTML = `<input type=text value="11">`;
    earthDiv.style.marginTop = '-1em';
    const earthLabel = new CSS3DObject(earthDiv);
    earthLabel.position.set(0, 2, 0);
    scene.add(earthLabel);

  }



}
