import { Injectable } from '@angular/core';
import { SCENE } from '../config/base';
import { SkeletonHelper, AnimationMixer } from 'three';
import { GLTFLoader } from 'three-full';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BoxService } from './box.service';

@Injectable({
  providedIn: 'root'
})
export class Box1Service {

  constructor(
    private box: BoxService,
  ) {
    // this.box.a();
  }


  a() {
    console.log(1111111111111111111111);
  }


}
