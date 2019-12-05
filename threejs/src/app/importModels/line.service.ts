import { Injectable } from '@angular/core';

import { Color, Mesh, Object3D, Geometry, LineBasicMaterial, Vector3, Line, SplineCurve, Vector2, BufferGeometry } from 'three';
import { SCENE, CAMERA } from '../config/base';
import * as THREE from 'three';
@Injectable({
  providedIn: 'root'
})
export class LineService {

  constructor() { }
  addLine2() {
    // const line = new Geometry();

    // const g = new MeshLine();
    // const geometry = new Geometry();


    // const material = new MeshLineMaterial({
    //   color: 0xffff00,
    //   lineWidth: 1,
    //   // useMap: false,
    //   opacity: 1,
    //   near: CAMERA.near,
    //   far: CAMERA.far
    //   // sizeAttenuation: !false,
    // });

    // line.vertices.push(
    //   new Vector3(5, 0, 0),
    //   new Vector3(0, 0, 0),
    // );
    // g.setGeometry(line);
    // const mesh = new Mesh(g.geometry, material);
    // SCENE.add(mesh);


  }

  addline() {
    // Create a sine-like wave
    const curve = new SplineCurve([
      new Vector2(-10, 0),
      new Vector2(-5, 5),
      new Vector2(0, 0),
      new Vector2(5, -5),
      new Vector2(10, 0)
    ]);

    const points = curve.getPoints(50);
    const geometry = new BufferGeometry().setFromPoints(points);

    const material = new LineBasicMaterial({ color: 0xff0000 });

    // Create the final object to add to the scene
    const splineObject = new Line(geometry, material);
    SCENE.add(splineObject);
  }

  // a(){
  //   const binormal = new THREE.Vector3();
  //   const normal = new THREE.Vector3();
  //   const pipeSpline = new THREE.CatmullRomCurve3([
  //     new THREE.Vector3(0, 10, - 10), new THREE.Vector3(10, 0, - 10),
  //     new THREE.Vector3(20, 0, 0), new THREE.Vector3(30, 0, 10),
  //     new THREE.Vector3(30, 0, 20), new THREE.Vector3(20, 0, 30),
  //     new THREE.Vector3(10, 0, 30), new THREE.Vector3(0, 0, 30),
  //     new THREE.Vector3(- 10, 10, 30), new THREE.Vector3(- 10, 20, 30),
  //     new THREE.Vector3(0, 30, 30), new THREE.Vector3(10, 30, 30),
  //     new THREE.Vector3(20, 30, 15), new THREE.Vector3(10, 30, 10),
  //     new THREE.Vector3(0, 30, 10), new THREE.Vector3(- 10, 20, 10),
  //     new THREE.Vector3(- 10, 10, 10), new THREE.Vector3(0, 0, 10),
  //     new THREE.Vector3(10, - 10, 10), new THREE.Vector3(20, - 15, 10),
  //     new THREE.Vector3(30, - 15, 10), new THREE.Vector3(40, - 15, 10),
  //     new THREE.Vector3(50, - 15, 10), new THREE.Vector3(60, 0, 10),
  //     new THREE.Vector3(70, 0, 0), new THREE.Vector3(80, 0, 0),
  //     new THREE.Vector3(90, 0, 0), new THREE.Vector3(100, 0, 0)
  //   ]);

  //   const sampleClosedSpline = new THREE.CatmullRomCurve3([
  //     new THREE.Vector3(0, - 40, - 40),
  //     new THREE.Vector3(0, 40, - 40),
  //     new THREE.Vector3(0, 140, - 40),
  //     new THREE.Vector3(0, 40, 40),
  //     new THREE.Vector3(0, - 40, 40)
  //   ]);

  //   sampleClosedSpline.curveType = 'catmullrom';
  //   sampleClosedSpline.closed = true;
  //   var wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.3, wireframe: true, transparent: true });
  // }
}
