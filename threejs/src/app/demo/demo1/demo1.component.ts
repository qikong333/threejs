import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  Scene, PerspectiveCamera,
  WebGLRenderer, PointLight,
  GridHelper,
  AmbientLight,
  MeshNormalMaterial,
  BoxGeometry,
  SphereGeometry,
  Mesh,
  Group,
  Raycaster,
  Vector2,
  Vector3,
  AnimationMixer,
  Clock,
  Matrix4,
  Quaternion,
  Line3,
  Color,
  AxesHelper,
  LineBasicMaterial,
  Geometry,
  Line,
  ArrowHelper,
  BufferGeometry,
  VertexColors,
  Float32BufferAttribute,
  Object3D,
  LineDashedMaterial,
  LineSegments,
  CatmullRomCurve3,

} from 'three';
import {
  FXAAShader, ShaderPass, FilmPass, OutlinePass, GeometryUtils, CopyShader,
  OrbitControls, GLTFLoader, EffectComposer, RenderPass
} from 'three-full';
import { MeshLine, MeshLineMaterial, Wireframe, IcosahedronBufferGeometry, WireframeGeometry2, LineMaterial } from 'three.meshline';

import { fromEvent, of } from 'rxjs';
import { Tween } from '@tweenjs/tween.js';
import * as TWEEN from '@tweenjs/tween.js';
import * as Stats from 'stats.js';


@Component({
  selector: 'app-demo1',
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.scss']
})
export class Demo1Component implements OnInit {
  @ViewChild('canvasFrame', { static: true }) canvasContainer: ElementRef;
  constructor() { }
  PerspectiveCamera = {
    fov: 30, // 拍摄距离  视野角值越大，场景中的物体越小
    near: 1, //  最小范围
    far: 1000, //  最大范围
  };

  //  DOM对象
  camera;
  renderer;
  scene;
  controls;
  selectedObjects = [];
  group: Group;
  group2: Group;
  thingA;
  thingB;

  mixer;

  activeAction;
  actions;

  x = -20;
  y = 10;
  z = -10;

  tagger;

  composer;

  layerData = [];

  gltf;

  raycaster = new Raycaster();
  mouse: Vector2;
  outlinePass: OutlinePass;
  outlinePass2: OutlinePass;

  serviceBox;

  outlinePassWarn;
  box;
  door;
  ngOnInit() {
    console.log(this.canvasContainer);
    console.log(this.mouse);

    this.init();

    // //  添加点击事件
    // const $a = fromEvent(this.canvasContainer.nativeElement, 'click');
    // $a.subscribe(r => {
    //   // console.log(r);
    //   this.pickupObjects(r);
    // });


    // // 鼠标经过事件
    // const $b = fromEvent(this.canvasContainer.nativeElement, 'mousemove');
    // $b.subscribe(r => {
    //   // console.log(r);
    //   this.onTouchMove(r);
    // });

    // window.addEventListener('mousemove', (event) => {
    //   this.onTouchMove(event);
    // });




  }



  init() {
    console.log(this.canvasContainer.nativeElement);


    //  渲染器
    this.renderer = new WebGLRenderer({ antialias: true }); //  渲染器(去)
    this.renderer.setSize(
      this.canvasContainer.nativeElement.clientWidth,
      this.canvasContainer.nativeElement.clientHeight
    );
    // this.renderer.setClearColor(0x000000, 1.0);    //  颜色
    this.renderer.shadowMap.enabled = true; // 辅助线
    this.renderer.shadowMapSoft = true; // 柔和阴影
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);





    //  镜头
    this.camera = new PerspectiveCamera(this.PerspectiveCamera.fov,
      this.canvasContainer.nativeElement.clientWidth /
      this.canvasContainer.nativeElement.clientHeight,
      this.PerspectiveCamera.near, this.PerspectiveCamera.far);
    this.camera.position.set(20, 10, 10);
    this.camera.lookAt(0, 0, 0);

    // 控制镜头
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    //  场景
    this.scene = new Scene();
    this.scene.background = new Color(0xcccccc);
    // this.scene.add(new AxesHelper(4));

    //  灯光
    const ambientLight = new AmbientLight(0xffffff, 0.2);    // 全局光
    ambientLight.position.set(10, 20, 55);   // 灯光
    this.scene.add(ambientLight);

    // 点光源
    const pointLight = new PointLight(0xffffff);
    this.camera.add(pointLight);

    this.scene.add(this.camera);

    //  网格
    const gridHelper = new GridHelper(100, 50);
    this.scene.add(gridHelper);


    // this.importantModel();

    const loader = new GLTFLoader();
    loader.load('assets/model/people/RobotExpressive.glb', (gltf) => {
      console.log(gltf);
      gltf.scene.traverse((child) => {  // 遍历判断Mesh
        if (child.isMesh) {


        }
      });

      this.scene.add(gltf.scene);
      // // 调用动画
      this.mixer = new AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        this.mixer.clipAction(clip).play();
      });

      console.log(this.mixer);




    },
      undefined,
      (error) => {
        console.error(error);
      });

    const delta = new Clock();
    //  渲染
    const render = () => {
      requestAnimationFrame(render);
      this.renderer.render(this.scene, this.camera);

      this.controls.update();


      if (this.mixer) {

        this.mixer.update(delta.getDelta());
      }
    };
    render();

  }

  model() {
    const normalMaterial = new MeshNormalMaterial();

    const cubeGeom = new BoxGeometry(6, 6, 6);
    const sphereGeom = new SphereGeometry(5, 10, 10);

    const cube = new Mesh(cubeGeom, normalMaterial);
    const sph = new Mesh(sphereGeom, normalMaterial);
    cube.position.set(-6, 12, 0);
    sph.position.set(6, 12, 0);
    const group = new Group();
    group.add(cube);
    group.add(sph);
    this.scene.add(group);

  }

  importantModel() {
    const loader = new GLTFLoader();
    loader.load('assets/model/1.gltf', (gltf) => {
      console.log(gltf);

      gltf.scene.traverse((child) => {  // 遍历判断Mesh
        if (child.isMesh) {
          console.log(child);

          child.material.color = { r: 1, g: 2, b: 3 };    //  颜色
          child.material.metalness = 0.8;   //  金属度
          //  给模型绑定相应数据
          // child.data = [{ id: child.id }];
          this.gltf = child;
        }
      });
      this.thingA = this.gltf.clone();
      this.thingA.translateY(5);
      this.thingA.translateZ(5);
      this.thingB = this.gltf.clone();
      this.thingB.translateX(2);
      // this.group.add(this.thingA);
      // this.group.add(this.thingB);
      this.scene.add(this.thingA);
      this.scene.add(this.thingB);
      // this.thingA.add(this.thingB);

    },
      undefined,
      (error) => {
        console.error(error);
      });
  }

  importantModel2() {
    this.group2 = new Group();
    const loader = new GLTFLoader();
    //
    loader.load('assets/model/box/a1_guizi.gltf', (gltf) => {
      console.log(gltf);
      this.group2.add(gltf.scene);


    },
      undefined,
      (error) => {
        console.error(error);
      });

    // loader.load('assets/model/dcvroom/dcvroom/jifang01.gltf', (gltf) => {
    //   console.log(gltf);
    //   this.group2.add(gltf.scene);
    // },
    //   undefined,
    //   (error) => {
    //     console.error(error);
    //   });

    loader.load('assets/model/jxs/guizi.gltf', (gltf) => {
      console.log(gltf);
      this.group2.add(gltf.scene);
    },
      undefined,
      (error) => {
        console.error(error);
      });

    loader.load('assets/model/jxs/fuwuqi.gltf', (gltf) => {
      console.log(gltf);
      this.group2.add(gltf.scene);
    },
      undefined,
      (error) => {
        console.error(error);
      });


    loader.load('assets/model/serverBox/fuwuqi.gltf', (gltf) => {
      console.log(gltf);
      gltf.scene.translateX(1);
      gltf.scene.rotation.set(0, 1.50 * Math.PI, 0);
      gltf.scene.position.set(0, 1.75, 0);
      this.serviceBox = gltf.scene;
      this.group2.add(this.serviceBox);
    },
      undefined,
      (error) => {
        console.error(error);
      });

    loader.load('assets/model/box/a2_men.gltf', (gltf) => {
      console.log(gltf);
      gltf.scene.traverse((child) => {  // 遍历判断Mesh
        if (child.isMesh) {
          console.log(child);
          child.translateY(-0.5);
          child.translateX(-0.3);
        }
      });
      this.group = new Group();
      this.group.add(gltf.scene);
      this.group.position.set(-0.3, 0, -0.5);
      this.group2.add(this.group);
      this.scene.add(this.group2);
      console.log(this.group2);

    },
      undefined,
      (error) => {
        console.error(error);
      });



  }

  // 增加
  add() {
    const a = this.serviceBox.clone();
    a.translateY(-0.3);
    this.scene.add(a);
  }

  onTouchMove(event) {
    // console.log(event);

    let x: any;
    let y: any;
    if (event.changedTouches) {
      x = event.changedTouches[0].pageX;
      y = event.changedTouches[0].pageY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }
    const mouse = new Vector2();
    mouse.x = (x / this.canvasContainer.nativeElement.clientWidth) * 2 - 1;
    mouse.y = - (y / this.canvasContainer.nativeElement.clientHeight) * 2 + 1;
    // console.log(this.raycaster);


    this.raycaster.setFromCamera(mouse, this.camera);
    // this.raycaster.linePrecision = 1;
    const intersects = this.raycaster.intersectObjects([this.scene], true);
    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      // console.log(selectedObject);

      this.selectedObjects = [];
      this.selectedObjects.push(selectedObject);
      this.outlinePass.selectedObjects = this.selectedObjects;

    } else {
      this.outlinePass.selectedObjects = [];
    }
  }



  pickupObjects(e) {
    console.log(e);


    // 将鼠标点击位置的屏幕坐标转成threejs中的标准坐标

    let x: any;
    let y: any;
    if (e.changedTouches) {
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    const mouse = new Vector2();
    mouse.x = (x / this.canvasContainer.nativeElement.clientWidth) * 2 - 1;
    mouse.y = - (y / this.canvasContainer.nativeElement.clientHeight) * 2 + 1;

    // 从相机发射一条射线，经过鼠标点击位置
    this.raycaster.setFromCamera(mouse, this.camera);


    // 获取单个模型***
    // 计算射线相机到的对象，可能有多个对象，因此返回的是一个数组，
    // 按离相机远近排列 *****

    const intersects = this.raycaster.intersectObjects([this.scene], true);
    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;

      console.log(selectedObject);


      this.tagger = selectedObject;
    } else {

    }

  }


  move() {
    console.log(this.group);

    const a = this.group.rotation.clone();
    const t = new TWEEN.Tween(a)
      .to({ x: 0, y: 0.80 * Math.PI, z: 0 }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        console.log(obj);

        this.group.rotation.set(obj.x, obj.y, obj.z);
      })
      ;
    t.start();

  }

  close() {

    const a = this.group.rotation.clone();
    const t = new TWEEN.Tween(a)
      .to({ x: 0, y: 0, z: 0 }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        this.group.rotation.set(obj.x, obj.y, obj.z);
      })
      ;
    t.start();

  }

  addLine() {
    const g = new MeshLine();
    const geometry = new Geometry();
    geometry.vertices.push(
      new Vector3(-10, 0, 0),
      new Vector3(0, 10, 0),
      new Vector3(0, 10, 10),
      new Vector3(10, 0, 0)
    );

    g.setGeometry(geometry);
    const material = new MeshLineMaterial({
      // useMap: false,
      color: new Color(0x0000ff),
      opacity: 1,
      // sizeAttenuation: !false,
      lineWidth: 0.1,
    });

    const line = new Mesh(g.geometry, material);
    this.scene.add(line);
  }

  addLineArr(...arr) {
    const g = new MeshLine();
    const geometry = new Geometry();
    geometry.vertices.push(
      ...arr
    );

    g.setGeometry(geometry);
    const material = new MeshLineMaterial({
      // useMap: false,
      color: new Color(0x0000ff),
      opacity: 1,
      // sizeAttenuation: !false,
      lineWidth: 0.1,
    });

    const line = new Mesh(g.geometry, material);
    this.scene.add(line);
  }

  help() {
    const dir = new Vector3(1, 2, 0);

    dir.normalize();

    const origin = new Vector3(0, 0, 0);
    const length = 1;
    const hex = 0xffff00;

    const arrowHelper = new ArrowHelper(dir, origin, length, hex);
    this.scene.add(arrowHelper);
  }

  a() {
    this.thingA.add(this.thingB);
  }


  genLineEffect(lineName: string, src: Vector3, dest: Vector3) {
    const geometry = new BufferGeometry();
    const material = new LineBasicMaterial({ vertexColors: VertexColors, linewidth: 20, });
    const colors = [];
    const points = [];

    src.y += 0.1;
    dest.y += 0.1;

    const pfnc = (v: Vector3) => {
      points.push(v.x, v.y, v.z);
    };

    const cfnc = (...items: any[]) => {
      for (const item of items) {
        colors.push(item);
      }
    };

    pfnc(src);

    pfnc(new Vector3(src.x, src.y, dest.z));
    if (src.y !== dest.y) {
      pfnc(new Vector3(src.x, dest.y, dest.z));
    }

    pfnc(dest);

    const r = 100;
    for (let i = 0; i < points.length / 3; i++) {
      const x = Math.random() * r - r / 2;
      const y = Math.random() * r - r / 2;
      const z = Math.random() * r - r / 2;
      cfnc((x / r) + 0.5, (y / r) + 0.5, (z / r) + 0.5);
    }

    geometry.addAttribute('position', new Float32BufferAttribute(points, 3));
    geometry.addAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    const line = new Line(geometry, material);
    line.name = lineName;
    this.scene.add(line);
  }



  initOutlinePass() {

    this.outlinePassWarn = new OutlinePass(new Vector2(
      this.canvasContainer.nativeElement.clientWidth,
      this.canvasContainer.nativeElement.clientHeight), this.scene, this.camera);
    // 高亮效果
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);


    const outlineParams = {
      edgeStrength: 5,
      edgeGlow: 0,
      edgeThickness: 3,
      pulsePeriod: 0,
      usePatternTexture: false,
      visualColor: 0xFFFFFF,
      hiddenColor: 0x222222,
      visualColorWarn: 0xFF1122,
      hiddenColorWarn: 0xFF0055,
      pulsePeriodWarn: 1,
    };

    this.outlinePass.edgeStrength = outlineParams.edgeStrength;
    this.outlinePass.edgeGlow = outlineParams.edgeGlow;
    this.outlinePass.visibleEdgeColor.set(outlineParams.visualColorWarn);
    this.outlinePass.hiddenEdgeColor.set(outlineParams.hiddenColorWarn);
    this.composer.addPass(this.outlinePass); //  后期特效合成器，给场景选中物体添加发光特效


    this.outlinePassWarn.renderToScreen = true;
    this.composer.addPass(this.outlinePassWarn);
    this.selectedObjects.push(this.thingA);
    this.outlinePassWarn.selectedObjects = this.selectedObjects;
    // this.outlinePassWarn.selectedObjects = [this.thingA];

  }


  addLine2() {
    // Build an array of points
    const segmentLength = 1;
    const nbrOfPoints = 10;
    const points = [];
    for (let i = 0; i < nbrOfPoints; i++) {
      points.push(i * segmentLength, 0, 0);
    }

    // Build the geometry
    const line = new MeshLine();
    line.setGeometry(points);
    const geometry = line.geometry;

    // Build the material with good parameters to animate it.
    const material = new MeshLineMaterial({
      transparent: true,
      lineWidth: 10,
      color: new Color('#ff0000'),
      dashArray: 2,     // always has to be the double of the line
      dashOffset: 0,    // start the dash at zero
      dashRatio: 0.75,  // visible length range min: 0.99, max: 0.5
    });

    // Build the Mesh
    const lineMesh = new Mesh(geometry, material);
    lineMesh.position.x = 0;
    const graph = new Object3D();
    graph.add(lineMesh);
    this.scene.add(lineMesh);
  }

  addline3() {
    // const geometry = new Geometry();
    // const material = new LineBasicMaterial({
    //   color: 0x0000ff
    // });
    // for (let i = 0; i < 20; i++) {
    //   geometry.vertices.push(
    //     new Vector3(-10 + i, 0, 0),
    //     new Vector3(0, 10 + i, 0),
    //     new Vector3(10 + i, 0, 0)
    //   );
    //   const line = new Line(geometry, material);
    //   this.scene.add(line);
    // }

    const geometry = new Geometry();
    const material = new LineBasicMaterial({
      color: 0xffff00
    });
    let line;
    for (let i = 0; i <= 20; i++) {
      geometry.vertices.push(
        new Vector3(i, 0, 0),
        new Vector3(i + 0.1, 0, 0),
      );
      geometry.vertices.push(
        new Vector3(0, i, 0),
        new Vector3(0, i + 0.1, 0),
      );
      line = new Line(geometry, material);
      line.position.y = 1 * i;
      this.scene.add(line);
    }


  }



}
