import { Injectable } from '@angular/core';
import { RENDERER, SCENE, CAMERA } from '../config/base';
import {
  FXAAShader, ShaderPass, FilmPass, OutlinePass, GeometryUtils, CopyShader,
  OrbitControls, GLTFLoader, EffectComposer, RenderPass
} from 'three-full';
import { Vector2 } from 'three';
@Injectable({
  providedIn: 'root'
})
export class OutlinePassService {
  outlinePass;
  constructor() { }

  outLine(event) {
    const composer = new EffectComposer(RENDERER);
    const renderPass = new RenderPass(SCENE, CAMERA);
    composer.addPass(renderPass);
    this.outlinePass = new OutlinePass(
      new Vector2(event.clientWidth,
        event.clientHeight),
      SCENE,
      CAMERA);
    composer.addPass(this.outlinePass);
    const effectFXAA = new ShaderPass(FXAAShader);
  }
}
