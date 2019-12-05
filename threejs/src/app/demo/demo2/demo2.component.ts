import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as THREEF from 'three-full';
@Component({
  selector: 'app-demo2',
  templateUrl: './demo2.component.html',
  styleUrls: ['./demo2.component.scss']
})
export class Demo2Component implements OnInit {

  constructor() { }

  ngOnInit() {
    let scene = null;
    let normal = null;
    let outline = null;
    let outScene = null;
    let maskScene = null;
    // let light = null;
    let renderer = null;
    let composer = null;
    let camera1 = null;
    let camera2 = null;
    let camera3 = null;
    let mesh1 = null;
    let mesh2 = null;
    let mesh3 = null;
    let bgmesh = null;
    let renderTarget = null;
    let outlinePass = null;

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    const selectedObjects = [];
    // selectedObjects.push(lineGroup);//给选中的线条和物体加发光特效
    // selectedObjects.push(intersects[0].object);


    const clock = new THREE.Clock();

    // let elapsedTime = 0;
    // let frameCount = 0;

    const init = () => {

      // SCENE


      scene = new THREE.Scene();
      // scene.background = new THREE.Color(0xcccccc);
      maskScene = new THREE.Scene();
      // maskScene.background = new THREE.Color(0xcccccc);
      outScene = new THREE.Scene();
      // maskScene.background = new THREE.Color(0xcccccc);
      setModel();

      // SCENE CAMERA

      camera1 = new THREE.PerspectiveCamera(40, screenWidth / screenHeight, 1, 1000);
      camera1.position.set(0, 0, 10);
      scene.add(camera1);

      camera2 = new THREE.PerspectiveCamera(40, screenWidth / screenHeight, 1, 1000);
      camera2.position.set(0, 0, 10);
      outScene.add(camera2);

      camera3 = new THREE.PerspectiveCamera(40, screenWidth / screenHeight, 1, 1000);
      camera3.position.set(0, 0, 10);
      maskScene.add(camera3);

      scene.background = new THREE.Color(0xcccccc);

      // RENDERER

      renderer = new THREE.WebGLRenderer({

        antialias: true
      });


      renderer.setSize(screenWidth, screenHeight);
      renderer.setClearColor(0xcccccc);
      renderer.autoClear = false;
      renderer.gammaInput = true;
      renderer.gammaOutput = true;

      document.body.appendChild(renderer.domElement);

      // POSTPROCESSING

      const renderTargetParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: true
      };

      renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,
        renderTargetParameters);

      composer = new THREEF.EffectComposer(renderer);
      composer.renderTarget1.stencilBuffer = true;
      composer.renderTarget2.stencilBuffer = true;

      normal = new THREEF.RenderPass(scene, camera1);
      outline = new THREEF.RenderPass(outScene, camera2);
      outline.clear = false;

      const mask = new THREEF.MaskPass(maskScene, camera3);
      mask.inverse = false;
      const clearMask = new THREEF.ClearMaskPass();
      const copyPass = new THREEF.ShaderPass(THREEF.CopyShader);
      copyPass.renderToScreen = true;

      const effectSepia = new THREEF.ShaderPass(THREEF.SepiaShader);
      effectSepia.uniforms['amount'.toString()].value = 0.5;

      const effectColorify = new THREEF.ShaderPass(THREEF.ColorifyShader);
      effectColorify.uniforms['color'.toString()].value.setRGB(0.7, 0.4, 10);

      const effectColorify2 = new THREEF.ShaderPass(THREEF.ColorifyShader);
      effectColorify2.uniforms['color'.toString()].value.setRGB(0.5, 0.5, 10);

      const fxaaPass = new THREEF.ShaderPass(THREEF.FXAAShader);
      // fxaaPass.renderToScreen = true;
      const pixelRatio = renderer.getPixelRatio();
      fxaaPass.material.uniforms.resolution.value.x = 1 / (window.innerWidth * pixelRatio);
      fxaaPass.material.uniforms.resolution.value.y = 1 / (window.innerHeight * pixelRatio);

      outlinePass = new THREEF.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), mesh2, camera1);
      // outlinePass = new THREEF.OutlinePass(new THREE.Vector2(
      //   window.innerWidth,
      //   window.innerHeight), scene, camera1);
      // const outlineParams = {
      //   edgeStrength: 2.5,
      //   edgeGlow: 0,
      //   edgeThickness: 3.3,
      //   pulsePeriod: 2,
      //   usePatternTexture: false,
      //   visualColor: 0xFFFFFF,
      //   hiddenColor: 0x222222,
      //   visualColorWarn: 0xFF1122,
      //   hiddenColorWarn: 0xFF0055,
      //   pulsePeriodWarn: 1,
      // };
      // outlinePass.edgeStrength = outlineParams.edgeStrength;
      // outlinePass.edgeGlow = outlineParams.edgeGlow;
      // outlinePass.visibleEdgeColor.set(outlineParams.visualColor);
      // outlinePass.hiddenEdgeColor.set(outlineParams.hiddenColor);
      // outlinePass.pulsePeriod = outlineParams.pulsePeriod;

      // outlinePass.renderToScreen = true;
      // composer.setSize(window.innerWidth, window.innerHeight);

      composer.addPass(normal);
      // composer.addPass(mask);
      // composer.addPass(outline);
      // composer.addPass(clearMask);

      composer.addPass(mask);
      composer.addPass(effectColorify);
      composer.addPass(clearMask);

      composer.addPass(mask);
      composer.addPass(effectColorify2);
      composer.addPass(clearMask);

      // composer.addPass(mask);
      // composer.addPass(fxaaPass);
      // composer.addPass(clearMask);

      composer.addPass(mask);
      composer.addPass(outlinePass);
      composer.addPass(clearMask);

      composer.addPass(copyPass);

      // EVENTS

      return window.addEventListener('resize', onWindowResize, false);
    };

    const setModel = () => {

      // tslint:disable-next-line:variable-name
      const boxmask1 = new THREE.CircleGeometry(2, 4);
      const boxmask2 = new THREE.CircleGeometry(2, 4);

      const singleGeometrymask = new THREE.Geometry();

      const boxMeshmask1 = new THREE.Mesh(boxmask1);
      boxMeshmask1.position.z = 1;
      const boxMeshmask2 = new THREE.Mesh(boxmask2);
      boxMeshmask2.rotation.y = Math.PI;
      boxMeshmask2.position.z = -1;

      boxMeshmask1.updateMatrix(); // as needed
      singleGeometrymask.merge(boxMeshmask1['geometry'.toString()], boxMeshmask1.matrix);
      boxMeshmask2.updateMatrix(); // as needed
      singleGeometrymask.merge(boxMeshmask2['geometry'.toString()], boxMeshmask2.matrix);


      const box11 = new THREE.CircleGeometry(2, 4);
      const box12 = new THREE.CircleGeometry(2, 4);

      const singleGeometry1 = new THREE.Geometry();

      const boxMesh11 = new THREE.Mesh(box11);
      boxMesh11.position.z = -1;
      const boxMesh12 = new THREE.Mesh(box12);
      boxMesh12.rotation.y = Math.PI;
      boxMesh12.position.z = 1;

      boxMesh11.updateMatrix();
      singleGeometry1.merge(boxMesh11['geometry'.toString()], boxMesh11.matrix);
      boxMesh12.updateMatrix();
      singleGeometry1.merge(boxMesh12['geometry'.toString()], boxMesh12.matrix);


      const box21 = new THREE.CircleGeometry(2, 4);
      const box22 = new THREE.CircleGeometry(2, 4);

      const singleGeometry2 = new THREE.Geometry();

      const boxMesh21 = new THREE.Mesh(box21);
      boxMesh21.position.z = -1;
      const boxMesh22 = new THREE.Mesh(box22);
      boxMesh22.rotation.y = Math.PI;
      boxMesh22.position.z = 1;

      boxMesh21.updateMatrix();
      singleGeometry2.merge(boxMesh21['geometry'.toString()], boxMesh21.matrix);

      boxMesh22.updateMatrix();
      singleGeometry2.merge(boxMesh22['geometry'.toString()], boxMesh22.matrix);

      const matColor = new THREE.MeshBasicMaterial({
        color: 0x000000
      });
      mesh1 = new THREE.Mesh(singleGeometry1, matColor); // geometry, matColor);
      // scene.add(mesh1);

      // flat mask
      const matFlat = new THREE.MeshBasicMaterial({
        color: 0x000000
      });
      mesh2 = new THREE.Mesh(singleGeometrymask, matFlat);
      selectedObjects.push(mesh2);
      maskScene.add(mesh2);

      const matColor2 = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      mesh3 = new THREE.Mesh(singleGeometry2, matColor2);

      // selectedObjects.push(mesh3);
      outScene.add(mesh3);

      const matColor3 = new THREE.MeshBasicMaterial({
        color: 0x000000
      });

      bgmesh = new THREE.Mesh(new THREE.CircleGeometry(100, 4), matColor3);

      outScene.add(bgmesh);
      bgmesh.position.set(0, 0, -10);

    };

    const onWindowResize = () => {

      screenWidth = window.innerWidth;
      screenHeight = window.innerHeight;

      camera1.aspect = screenWidth / screenHeight;
      camera2.aspect = camera1.aspect;
      camera3.aspect = camera1.aspect;

      camera1.updateProjectionMatrix();
      camera2.updateProjectionMatrix();
      camera3.updateProjectionMatrix();

      return renderer.setSize(screenWidth, screenHeight);
    };

    const animate = () => {

      // updateFps();
      requestAnimationFrame(animate);
      return render();
    };

    const render = () => {

      const now = Date.now();
      const delta = clock.getDelta();

      if (mesh1) {
        // mesh1.rotation.y += 0.015;
        // mesh2.rotation.y = mesh1.rotation.y;
        // mesh3.rotation.y = mesh1.rotation.y;
      }

      return composer.render();
    };

    // const updateFps = () => {

    //   elapsedTime += clock.getDelta();
    //   frameCount++;

    //   if (elapsedTime >= 1) {
    //     $('#fps').html(frameCount);
    //     frameCount = 0;
    //     return elapsedTime = 0;
    //   }
    // };


    init();
    // outlinePass.selectedObjects = maskScene;
    animate();
  }



}
