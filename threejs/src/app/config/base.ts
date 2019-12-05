import {
    Scene,
    AmbientLight,
    PointLight,
    WebGLRenderer,
    PerspectiveCamera,
    GridHelper,
    Color,
    SkeletonHelper,
    HemisphereLight,
    DirectionalLight,
    AnimationMixer
} from 'three';
import {
    OrbitControls, CSS3DRenderer
} from 'three-full';
import * as Stats from 'stats.js';
import * as TWEEN from '@tweenjs/tween.js';



//  渲染器
export const RENDERER = new WebGLRenderer({ antialias: true }); //  渲染器(去据此){ antialias: true }
export function initRenderer(doc) {
    RENDERER.setSize(
        doc.clientWidth,
        doc.clientHeight
    );
    RENDERER.shadowMap.enabled = true; // 辅助线
    doc.appendChild(RENDERER.domElement);


}


// 场景
export const SCENE = new Scene();
export function initScene() {
    SCENE.background = new Color(0xcccccc);
}

//  灯光
export function initLight() {
    // 全局光
    const ambientLight = new AmbientLight(0xffffff, 1);
    SCENE.add(ambientLight);

    // //  半球光
    // const light = new HemisphereLight(0xffffff, 0x080820, 1);
    // // CAMERA.add(light);
    // SCENE.add(light);

    // 点光源
    const pointLight = new PointLight(0xffffff);
    pointLight.distance = 0;
    CAMERA.add(pointLight);
    SCENE.add(CAMERA);

    // 方向灯
    const directionalLight = new DirectionalLight(0xffffff, 2);
    SCENE.add(directionalLight);

}

//  相机
export let CAMERA;
export let CONTROLS;
export function initCamera(doc) {
    const d = {
        fov: 30, // 拍摄距离  视野角值越大，场景中的物体越小
        near: 1, //  最小范围
        far: 1000, //  最大范围
    };
    CAMERA = new PerspectiveCamera(
        d.fov,
        doc.clientWidth / doc.clientHeight,
        d.near,
        d.far)
        ;
    const p = {
        x: 20,
        y: 10,
        z: 10,
    };
    CAMERA.position.set(p.x, p.y, p.z);
    CAMERA.lookAt(0, 0, 0);
    CONTROLS = new OrbitControls(CAMERA, doc);  // 控制镜头
}


//  网格
export function initGrid() {
    const gridHelper = new GridHelper(100, 50);
    SCENE.add(gridHelper);
}


//  性能检测
export const STATS = new Stats();
export function initStats(doc) {
    STATS.setMode(0);
    STATS.domElement.style.position = 'absolute';
    STATS.domElement.left = '0px';
    STATS.domElement.top = '0px';
    doc.appendChild(STATS.domElement);
}

//  css
export const CSS3D = new CSS3DRenderer();
export function initCSS3D(doc) {
    CSS3D.setSize(doc.clientWidth, doc.clientHeight);
    CSS3D.domElement.style.position = 'absolute';
    CSS3D.domElement.style.zIndex = '1';

    CSS3D.domElement.style.top = 0;
    doc.appendChild(CSS3D.domElement);
}



//  动画混合器
export const MIX = [];
// export class MIXER {
//     public mx;
// }






