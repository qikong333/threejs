import { Injectable } from '@angular/core';
import { Raycaster, Vector2 } from 'three';
import { CAMERA, SCENE } from '../config/base';

@Injectable({
  providedIn: 'root'
})
export class PickupService {

  constructor() { }


  getThings(event, window) {

    // 将鼠标点击位置的屏幕坐标转成threejs中的标准坐标
    const raycaster = new Raycaster();
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
    mouse.x = (x / window.clientWidth) * 2 - 1;
    mouse.y = - (y / window.clientHeight) * 2 + 1;

    // 从相机发射一条射线，经过鼠标点击位置
    raycaster.setFromCamera(mouse, CAMERA);


    // 获取单个模型***
    // 计算射线相机到的对象，可能有多个对象，因此返回的是一个数组，
    // 按离相机远近排列 *****

    const intersects = raycaster.intersectObjects([SCENE], true);
    // console.log(intersects);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      console.log(selectedObject);
      return selectedObject;

    } else {
      return;
    }

  }
}
