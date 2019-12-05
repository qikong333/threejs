import { Injectable } from '@angular/core';
import { Vector3, Object3D, MeshBasicMaterial, SphereGeometry, Mesh, CatmullRomCurve3, TubeGeometry, SceneUtils } from 'three';
import { SCENE } from '../config/base';

@Injectable({
  providedIn: 'root'
})
export class LineService {

  constructor() { }

  drawLine() {
    // 以0.1为单位精度的话可以画出直线
    const points = [
      new Vector3(0, -10, 0),
      new Vector3(0, 4.9, 0),
      new Vector3(0, 5, 0),
      new Vector3(0, 5.1, 0),
      new Vector3(0, 5, 7.9),
      new Vector3(0, 5, 8),
      new Vector3(8.9, 5, 8),
      new Vector3(9, 5, 8),

    ];
    this.generatePoints(points, 500, 0.1, 10, false);
  }

  // 通过配置项绘制出几何体
  /**
   *
   * @param points：点
   * @param segments ：线的数量
   * @param radius:大小
   * @param radiusSegments:圆滑度
   * @param closed ：闭环
   */
  generatePoints(points, segments, radius, radiusSegments, closed) {
    const spGroup = new Object3D(); // 赋值spGroup存储模型点的3d对象
    const material = new MeshBasicMaterial({ color: 0xff0000, transparent: false });
    // 声明一个红色普通纹理
    // 将所有的顶点创建出球形存储到spGroup内
    points.forEach((point) => {

      const spGeom = new SphereGeometry(0.2);
      const spMesh = new Mesh(spGeom, material);
      spMesh.position.copy(point);
      spGroup.add(spMesh);
    });
    // 将spGroup对象添加到场景当中
    // SCENE.add(spGroup);

    // THREE.CatmullRomCurve3方法可以将一组顶点生成一条平滑的曲线
    const curve = new CatmullRomCurve3(points, false, 'centripetal', 0.1);
    const tubeGeometry = new TubeGeometry(curve, segments, radius, radiusSegments, closed);
    // 将模型对象赋值给tubeMesh并添加到场景当中
    const tubeMesh = this.createMesh(tubeGeometry);
    SCENE.add(tubeMesh);
  }

  createMesh(geom) {

    // 创建两个纹理
    // 创建一个透明纹理
    const meshMaterial = new MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 1 });

    // 创建一个线框纹理
    const wireFrameMat = new MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // 使用纹理和几何体创建模型
    const mesh = SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);
    return mesh;
  }
}
