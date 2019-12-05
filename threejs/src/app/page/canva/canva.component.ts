import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  initRenderer,
  initCamera,
  initScene, initLight,
  initGrid, initStats,
  RENDERER, CAMERA, SCENE, CONTROLS, STATS, initCSS3D, CSS3D,
} from '../../config/base';
import { ChassisService, LineService } from '../../importModels';
import {

  FXAAShader, SceneUtils,
  UnrealBloomPass, ShaderPass, FilmPass,
  OutlinePass, GeometryUtils, CopyShader, ColorifyShader, SepiaShader,
  OrbitControls, GLTFLoader, EffectComposer, RenderPass, SMAAShader, SMAAPass, ClearMaskPass, MaskPass,
} from 'three-full';
import * as TWEEN from '@tweenjs/tween.js';
import {
  Vector2, Group, Scene, SphereGeometry,
  ImageUtils, AnimationMixer, Mesh, ShapeGeometry,
  MeshPhongMaterial, DoubleSide, Shape,
  Object3D, TubeGeometry, CatmullRomCurve3,
  MeshBasicMaterial, Vector3, Raycaster,
  PlaneGeometry, Clock, MeshStandardMaterial, FaceNormalsHelper, Color, SkeletonHelper, LoopRepeat, LoopPingPong
} from 'three';
import { fromEvent, Observable, of, BehaviorSubject } from 'rxjs';
import { PickupService } from '../../service/pickup.service';
import * as THREE from 'three';
import { World, NaiveBroadphase, Material, Sphere, Plane } from 'cannon';

import * as CANNON from 'cannon';
import { SkeletonService } from '../../importModels/skeleton.service';
import { filter } from 'rxjs/operators';
import { FactoryService } from '../../importModels/factory.service';
import { MIX } from '../../config/base';
import { WebSocketService } from '../../shared/web-socket.service';
import { AdnimationService } from '../../importModels/adnimation.service';
import { BoxService } from '../../importModels/box.service';
import { Box1Service } from 'src/app/importModels/box1.service';
import { GlassService } from '../../importModels/glass.service';
@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss'],
  providers: [BoxService, Box1Service, AdnimationService]
})
export class CanvaComponent implements OnInit {
  @ViewChild('canvasFrame', { static: true }) canvasContainer: ElementRef;
  layerData = []; //  数据
  constructor(
    private chassis: ChassisService,
    private pk: PickupService,
    private line: LineService,
    private sk: SkeletonService,
    private fc: FactoryService,
    // private webSocketService: WebSocketService,
    private adnimation: AdnimationService,
    private box: BoxService,
    private box1: Box1Service,
    public glass: GlassService
  ) { }
  outlinePass;
  outlinePassWarn;
  composer = new EffectComposer(RENDERER);
  composer2 = new EffectComposer(RENDERER);
  selectedObjects = [];
  boxGroup;

  thing;
  thingComposer = new EffectComposer(RENDERER);

  boxA;
  boxB;

  sceneEarth = new Scene();

  //
  world = new World();
  thing1;
  thing2;
  sphere;
  sphereBody;

  sphereObject;
  sphereObjectBox;
  helper;
  ObjectboxA;
  ObjectboxB;
  //
  mixer;
  arrs = [];
  action;

  play = false;


  ngOnInit() {
    this.webscoket();
    this.init();
    this.boxGroup = new Group();
  }

  player() {
    this.play = !this.play;
    this.sk.isPlay(this.play);
  }

  init() {




    initRenderer(this.canvasContainer.nativeElement);
    initCamera(this.canvasContainer.nativeElement);
    initScene();
    initLight();
    initGrid();
    initStats(this.canvasContainer.nativeElement);
    initCSS3D(this.canvasContainer.nativeElement);
    this.addFunc();

    // this.toShaderPass();
    //  加载模型-star



    // this.line.addline();
    // this.chassis.box();
    // this.importantModel();
    // this.importYuan();
    // this.addBox();
    // this.sk.addSkeleton();
    // this.adnimation.addModel();
    // this.box.addModel();
    this.glass.addGlass();
    //  加载模型-end

    // this.initOutlinePass();
    const clock = new Clock();
    const rendererOut = () => {
      requestAnimationFrame(rendererOut);
      const delta = clock.getDelta();
      RENDERER.render(SCENE, CAMERA);
      CSS3D.render(SCENE, CAMERA);
      CONTROLS.update();



      STATS.update();
      this.fc.getmousewheel(CAMERA.position.y);


      if (this.box.mix().length > 0) {
        this.box.mix().map(r => {
          r.update(delta);
          // console.log(r.getRoot());

          // console.log(r.getEffectiveTimeScale());

        });
      }

      if (this.box.mix().length > 0) {
        this.box.mix().map(r => {
          r.update(delta);


        });
      }

      // // const mix = [];
      // // mix.push(this.adnimation.mix());
      // // mix.push(this.box.mix());
      // const mix = [...this.adnimation.mix(), ...this.box.mix()];
      // // console.log(mix);

      // if (mix.length > 0) {
      //   this.box.mix().map(r => {
      //     r.update(delta.getDelta());
      //   });
      //   this.adnimation.mix().map(r => {
      //     r.update(delta.getDelta());
      //   });
      // }






      // if (this.arrs) {
      //   this.arrs.map(r => {
      //     r.update(delta.getDelta());
      //   });
      // }
      // TWEEN.update();

      // this.world.step(1 / 60);

      // if (this.sphere) {
      //   this.sphere.position.copy(this.sphereBody.position);
      //   this.sphere.quaternion.copy(this.sphereBody.quaternion);
      // }


      // this.thingComposer.render();



    };

    rendererOut();

  }



  addFunc() {
    // document.addEventListener('mousewheel  ', () => {
    //   console.log(11111);

    // }, false);
    // console.log('添加事件');

    // //  鼠标滚动
    // // this.getTheBoolean().subscribe(value => console.log(value));
    // window.addEventListener('mousewheel', (event) => {
    //   console.log(111);
    // });



    //  添加点击事件
    const $a = fromEvent(this.canvasContainer.nativeElement, 'click');
    $a.subscribe(r => {

      // const a = this.pk.getThings(r, this.canvasContainer.nativeElement);
      console.log('点击');
      console.log(CAMERA.position.y);

      //  开门事件
      // this.chassis.doorActive(a);

      //  透明事件
      // this.chassis.fuwuqiActive(a, 0);
    });


  }


  initOutlinePass() {
    const pixelRatio = RENDERER.getPixelRatio();

    const renderPass = new RenderPass(SCENE, CAMERA);
    this.composer2.addPass(renderPass);

    const SMAApass = new SMAAPass(
      window.innerWidth * pixelRatio,
      window.innerHeight * pixelRatio
    );
    this.composer2.addPass(SMAApass);
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms.resolution.value.x = 1 / (this.canvasContainer.nativeElement.clientWidth * pixelRatio);
    fxaaPass.material.uniforms.resolution.value.y = 1 / (this.canvasContainer.nativeElement.clientHeight * pixelRatio);
    this.composer2.addPass(fxaaPass);
    const copyPass = new ShaderPass(CopyShader);
    this.composer2.addPass(copyPass);


    this.outlinePass = new OutlinePass(new Vector2(
      this.canvasContainer.nativeElement.clientWidth,
      this.canvasContainer.nativeElement.clientHeight), SCENE, CAMERA);
    const outlineParams = {
      edgeStrength: 2.5,
      edgeGlow: 0,
      edgeThickness: 3.3,
      pulsePeriod: 2,
      usePatternTexture: false,
      visualColor: 0xFFFFFF,
      hiddenColor: 0x222222,
      visualColorWarn: 0xFF1122,
      hiddenColorWarn: 0xFF0055,
      pulsePeriodWarn: 1,
    };
    this.outlinePass.edgeStrength = outlineParams.edgeStrength;
    this.outlinePass.edgeGlow = outlineParams.edgeGlow;
    this.outlinePass.visibleEdgeColor.set(outlineParams.visualColor);
    this.outlinePass.hiddenEdgeColor.set(outlineParams.hiddenColor);
    this.outlinePass.pulsePeriod = outlineParams.pulsePeriod;

    const sceneMask = new MaskPass(SCENE, CAMERA);
    const clearMask = new ClearMaskPass();

    renderPass.clear = true;
    this.outlinePass.renderToScreen = true;
    this.composer2.setSize(this.canvasContainer.nativeElement.clientWidth, this.canvasContainer.nativeElement.clientHeight);
    // this.composer2.addPass(sceneMask);
    this.composer2.addPass(this.outlinePass);
    // this.composer2.addPass(clearMask);
  }





  // 后期处理
  toShaderPass() {





    // const sceneMask = new MaskPass(SCENE, CAMERA);
    // const clearMask = new ClearMaskPass();
    // const SMAApass = new SMAAPass(
    //   this.canvasContainer.nativeElement.clientWidth * RENDERER.getPixelRatio(),
    //   this.canvasContainer.nativeElement.clientHeight * RENDERER.getPixelRatio()
    // );
    // this.composer.addPass(sceneMask);
    // this.composer.addPass(SMAApass);
    // this.composer.addPass(clearMask);

    const fxaaPass = new ShaderPass(FXAAShader);
    // fxaaPass.renderToScreen = true;
    const pixelRatio = RENDERER.getPixelRatio();
    fxaaPass.material.uniforms.resolution.value.x = 1 / (this.canvasContainer.nativeElement.clientWidth * pixelRatio);
    fxaaPass.material.uniforms.resolution.value.y = 1 / (this.canvasContainer.nativeElement.clientHeight * pixelRatio);
    // this.composer.addPass(sceneMask);
    this.composer.addPass(fxaaPass);
    // this.composer.addPass(clearMask);
    const copyPass = new ShaderPass(CopyShader);
    // copyPass.renderToScreen = true;
    this.composer.addPass(copyPass);



  }

  // 线框
  importantModel() {
    const loader = new GLTFLoader();
    loader.load('assets/model/1.gltf', (gltf) => {
      console.log(gltf);

      gltf.scene.traverse((child) => {  // 遍历判断Mesh
        if (child.isMesh) {
          console.log(child);

          child.material.color = { r: 1, g: 2, b: 3 };    //  颜色
          child.material.metalness = 0.8;   //  金属度
          child.material.transparent = true;
          child.material.opacity = 0.3;

          const wireframe = new THREE.WireframeGeometry(child.geometry);
          const line = new THREE.LineSegments(wireframe);
          line.material['depthTest'.toString()] = false;
          // line.material['opacity'.toString()] = 0.25;
          line.material['transparent'.toString()] = true;

          console.log(wireframe);
          console.log(line);

          SCENE.add(line);


          // 创建刚体
          this.thing1 = new Material('a');  // 材质
          const sphereBody = new CANNON.Body({ // 刚体
            mass: 5,    // 质量
            position: line['position'.toString()],    // 位置
            shape: child,
            material: line['material'.toString()],
          });
          this.world.addBody(sphereBody);
        }

        this.boxA = gltf.scene.clone();
        // SCENE.add(this.boxA);


      });
    },
      undefined,
      (error) => {
        console.error(error);
      });

    // loader.load('assets/model/1.gltf', (gltf) => {
    //   gltf.scene.traverse((child) => {  // 遍历判断Mesh
    //     if (child.isMesh) {
    //       child.material.color = { r: 5, g: 5, b: 8 };    //  颜色
    //       child.material.metalness = 0.9;   //  金属度
    //       child.material.transparent = true;
    //       child.material.opacity = 0.1;


    //       const wireframe = new THREE.WireframeGeometry(child.geometry);
    //       const line = new THREE.LineSegments(wireframe);
    //       line.material['depthTest'.toString()] = false;
    //       // line.material['opacity'.toString()] = 0.25;
    //       line.material['transparent'.toString()] = true;
    //       line.translateX(2.5);
    //       SCENE.add(line);
    //     }
    //     this.boxB = gltf.scene.clone();
    //     this.boxB.translateX(2.5);
    //     SCENE.add(this.boxB);

    //     // 创建刚体
    //     this.thing2 = new Material('a');
    //     const sphereBody = new CANNON.Body({ // 刚体
    //       mass: 5,    // 质量
    //       position: this.boxB['position'.toString()],    // 位置
    //       shape: this.boxB,
    //       material: this.thing2
    //     });
    //     this.world.addBody(sphereBody);
    //   });
    // },
    //   undefined,
    //   (error) => {
    //     console.error(error);
    //   });






  }

  thingCF() {
    const effectCopy = new ShaderPass(CopyShader);
    effectCopy.renderToScreen = true;
    const effectColorify = new ShaderPass(ColorifyShader);
    effectColorify.uniforms['color'.toString()].value.setRGB(0, 0, 0);
    const thingPass = new RenderPass(this.thing, CAMERA);
    const clearMash = new ClearMaskPass();
    const marsMask = new MaskPass(this.thing, CAMERA);
    this.thingComposer = new EffectComposer(RENDERER);
    this.thingComposer.renderTarget1.stencilBuffer = true;
    this.thingComposer.renderTarget2.stencilBuffer = true;

    this.thingComposer.addPass(thingPass);
    // this.thingComposer.addPass(marsMask);
    this.thingComposer.addPass(effectColorify);
    // this.thingComposer.addPass(clearMash);
    this.thingComposer.addPass(effectCopy);
  }

  t() {

    this.sceneEarth.add(this.thing);
    const renderPass = new RenderPass(this.sceneEarth, CAMERA);
    renderPass.clear = false;
    const effectCopy = new ShaderPass(CopyShader);
    effectCopy.renderToScreen = true;   //  这个东西一打开就黑屏

    const clearMask = new ClearMaskPass();
    const earthMask = new MaskPass(this.sceneEarth, CAMERA);

    const effectSepia = new ShaderPass(SepiaShader);
    effectSepia.uniforms['amount'.toString()].value = 0.8;

    const effectColorify = new ShaderPass(ColorifyShader);
    effectColorify.uniforms['color'.toString()].value.setRGB(0.15, 0.15, 10);



    this.thingComposer.renderTarget1.stencilBuffer = true;
    this.thingComposer.renderTarget2.stencilBuffer = true;

    this.thingComposer.addPass(renderPass);
    this.thingComposer.addPass(effectColorify);
    this.thingComposer.addPass(clearMask);
    this.thingComposer.addPass(earthMask);
    this.thingComposer.addPass(effectSepia);
    this.thingComposer.addPass(clearMask);
    this.thingComposer.addPass(effectCopy);
  }


  a() {
    // 設定重力場為 y 軸 -9.8 m/s²
    this.world.gravity.set(0, -9.8, 0);

    // 碰撞偵測
    this.world.broadphase = new NaiveBroadphase();

    //  创建球形刚体
    const sphereShape = new Sphere(1); // 形状
    this.thing1 = new Material('a');  // 材质
    this.sphereBody = new CANNON.Body({ // 刚体
      mass: 5,    // 质量
      position: new CANNON.Vec3(0, 10, 0),    // 位置
      shape: sphereShape,
      material: this.thing1
    });
    SCENE.add(this.sphereBody);
    this.world.addBody(this.sphereBody);


  }

  b() {
    // 平面 Body
    const groundShape = new Plane();   // 形状
    this.thing2 = new Material('b'); // 材质
    const groundBody = new CANNON.Body({  // 刚体
      mass: 0,    // 质量，质量为0时为静态刚体
      shape: groundShape,
      material: this.thing2
    });
    // setFromAxisAngle 旋转 X 轴 -90 度
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    this.world.addBody(groundBody);

  }

  c() {
    const sphereground = new CANNON.ContactMaterial(this.thing1, this.thing2, {
      //  定义两个刚体相遇后会发生什么
      friction: 1,    // 摩擦系数
      restitution: 0.4    // 恢复系数
    });
    this.world.addContactMaterial(sphereground);


  }

  d() {


    // 球网格
    const sphereGeometry = new SphereGeometry(1, 32, 32);
    const sphereMaterial = new MeshStandardMaterial({ color: 0xff0000 });
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    this.sphere.material.transparent = true;
    this.sphere.material.opacity = 0.3;
    SCENE.add(this.sphere);

  }

  e() {
    this.sphereObject = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.sphereObject.geometry.computeBoundingBox();
    this.sphereObjectBox = this.sphereObject.geometry.boundingBox.clone();
    console.log(this.sphereObjectBox);

    //  辅助线
    this.helper = new THREE.Box3Helper(this.sphereObjectBox);
    SCENE.add(this.helper);

    SCENE.add(this.sphereObject);

  }

  // 物体法线
  addBox() {



    const geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(geometry, material);

    const group = new Group();
    group.add(box);
    SCENE.add(group);


    // 法线
    const wireframe = new THREE.WireframeGeometry(box.geometry);
    const line = new THREE.LineSegments(wireframe);
    line.material['depthTest'.toString()] = false;
    line.material['opacity'.toString()] = 0.25;
    line.material['transparent'.toString()] = true;

    SCENE.add(line);


  }



  importYuan() {
    const loader = new GLTFLoader();
    loader.load('assets/model/yuan.glb', (gltf) => {
      console.log(gltf);

      gltf.scene.traverse((child) => {  // 遍历判断Mesh
        if (child.isMesh) {
          child.material.color = { r: 5, g: 5, b: 8 };    //  颜色
          child.material.metalness = 0.9;   //  金属度
          child.material.transparent = true;
          child.material.opacity = 0.8;

          child.geometry.computeBoundingBox();
          const a = child.geometry.boundingBox.clone();
          const helper2 = new THREE.Box3Helper(a);
          SCENE.add(helper2);

          // const helper = new FaceNormalsHelper(child, 2, 0x00ff00, 1);
          // SCENE.add(helper);
        }
        this.boxB = gltf.scene.clone();
        // this.boxB.translateX(2.5);
        SCENE.add(this.boxB);





        //  辅助线
        // const helper2 = new THREE.Box3Helper(this.boxB);
        // SCENE.add(helper2);
      });
    },
      undefined,
      (error) => {
        console.error(error);
      });






  }


  webscoket() {
    // // 连接websocket
    // this.webSocketService.connect('ws://192.168.200.212:8080/');
    // // 接收消息
    // this.webSocketService.messageSubject.subscribe(
    //   data => {
    //     console.log(data);
    //   },
    //   err => console.log(err)
    // );
  }

}
