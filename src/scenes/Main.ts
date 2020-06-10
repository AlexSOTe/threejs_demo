import { Scene, Mesh, Color, MeshLambertMaterial, SphereGeometry, PointLight, AxesHelper, MeshBasicMaterial, Vector3, Object3D, ImageUtils, MeshPhongMaterial, Fog, MeshPhysicalMaterial, Geometry, LineBasicMaterial, Line, SplineCurve, Line3, PerspectiveCamera, CameraHelper, OrthographicCamera, ParametricGeometry, Sprite, SpriteMaterial } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import renderer from "../components/Renderer";
import { TwoPointDistance3D, GetUrlParams } from "../utils/tools";

let vw = window.innerWidth;
let vh = window.innerHeight;
// 场景
const mainScene: Scene = new Scene();
//mainScene.fog = new Fog(0xff0000, 0.1, 1000);

class MainScene {
  // 灯光
  light: PointLight;
  // 鼠标控制
  controls: OrbitControls;
  // 星星的Geometry
  pointG: SphereGeometry;
  animationHandler?: number;
  // 主相机
  mainCamera: OrthographicCamera | PerspectiveCamera;
  // 描点时，描点位置和原点连线的旋转角度
  d: number = 0;
  // 控制点的密度，越小越密集
  distance: number = 0;
  // 星星的名字
  nameNym: number = 0;
  // 是否正在播放
  starting: boolean = false;
  // 星云体积
  nebulaVolume: number = 5000;
  // 太阳
  sun: Mesh;
  earth: Mesh;
  // 第二个相机
  camera2: PerspectiveCamera;
  earthRotateDistance: number = 0;
  stats: Stats;

  constructor() {
    this.light = new PointLight(0xffffff, 20, 10000, 1);
    this.mainCamera = this.InitMainCamera();
    this.controls = new OrbitControls(this.mainCamera, renderer.domElement);
    this.pointG = new SphereGeometry(1, 20, 20);
    // 初始化太阳
    this.sun = this.InitSun();
    this.earth = this.InitEarth();
    this.camera2 = this.InitCamera2();
    this.stats = Stats();
  }
  Init() {
    this.InitLight();
    this.InitControls();
    // 星云
    this.AddStar();
    // 粒子
    this.AddSprite();
    //// 线
    //this.AddLines();
    // 添加太阳
    this.AddSun();
    this.AddEarth(new Vector3(600, 0, 600));
    this.AddCamera2();
    // 添加坐标轴
    mainScene.add(new AxesHelper(10000));
    // 添加fps监控
    this.InitStats();

    let texture = ImageUtils.loadTexture('texture/ss.gif');
    let point = new Sprite(new SpriteMaterial({
      color: 0xffffff,
      map: texture,
      opacity: 1
    }));
    point.position.set(300, 300, 300);
    point.scale.set(500, 500, 500);
    mainScene.add(point);
  }
  InitStats() {
    document.body.appendChild(this.stats.dom);
  }
  InitCamera2() {
    let camera2 = new PerspectiveCamera(100, 1, 1, 5000);
    camera2.position.set(700, 1000, 700);
    camera2.lookAt(mainScene.position);
    return camera2;
  }
  AddCamera2() {
    this.camera2.lookAt(mainScene.position);
    //let helpCamera = new CameraHelper(this.camera2);
    mainScene.add(this.camera2);
  }
  InitMainCamera() {
    /**
     * 正交相机
     */
    function InitOrthographicCamera(): OrthographicCamera {
      let frustumSize = 600;
      var aspect = vw / vh;
      let cameraO = new OrthographicCamera(
        -frustumSize * aspect,
        frustumSize * aspect,
        frustumSize,
        -frustumSize,
        1,
        20000
      );
      return cameraO
    }
    ///**
    // * 透视相机
    // */
    function InitPerspectiveCamera(): PerspectiveCamera {
      let cameraP = new PerspectiveCamera(103, vw / vh, 0.1, 25000)
      //let w = 450
      //let h = 450
      //let fw = w * 2
      //let fh = h
      //cameraP.setViewOffset(fw, fh, w * 0, h * 0, w, h);
      return cameraP
    }
    let mainCamera: OrthographicCamera | PerspectiveCamera;
    if (GetUrlParams() === 'p') {
      mainCamera = InitPerspectiveCamera();
    } else {
      mainCamera = InitOrthographicCamera();
    }
    mainCamera.position.set(1000, 1000, 1000)
    mainCamera.lookAt(mainScene.position)
    return mainCamera
  }
  InitLight() {
    //this.light.position.set(-500, 0, -500)
    this.light.lookAt(0, 0, 0);
    mainScene.add(this.light);
  }
  InitControls() {
    // 如果使用 Animate 方法时，将此函数删除
    //this.controls.addEventListener( 'change', render )
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    this.controls.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //this.controls.dampingFactor = 0.25;
    //是否可以缩放
    this.controls.enableZoom = true;
    //是否自动旋转
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.6;
    //设置相机距离原点的最远距离
    this.controls.minDistance = 0.1;
    //设置相机距离原点的最远距离
    this.controls.maxDistance = 10000;
    //是否开启右键拖拽
    this.controls.enablePan = true;
  }
  InitSun() {
    let texture = ImageUtils.loadTexture('texture/sun.jpg');
    let sunG: SphereGeometry = new SphereGeometry(200, 100, 100);
    let sunM: MeshPhysicalMaterial = new MeshPhysicalMaterial({
      emissive: new Color(0xffffff), // emissive默认黑色，设置为白色
      emissiveMap: texture,
      emissiveIntensity: 0.8,
      //wireframe: true,
    });
    sunM.opacity = 0.3;
    let sun = new Mesh(sunG, sunM);
    return sun
  }
  AddSun(pos: Vector3 = new Vector3(0, 0, 0)) {
    let sun = this.sun.clone(true)
    sun.position.set(pos.x, pos.y, pos.z);
    mainScene.add(sun);
  }
  InitEarth() {
    let earthG: SphereGeometry = new SphereGeometry(50, 50, 50);
    let earthM: MeshPhysicalMaterial = new MeshPhysicalMaterial({
      color: new Color(0x0000ff)
    });
    earthM.opacity = 0.3;
    let earth = new Mesh(earthG, earthM);
    return earth
  }
  AddEarth(pos: Vector3 = new Vector3(0, 0, 0)) {
    this.earth.position.set(pos.x, pos.y, pos.z);
    mainScene.add(this.earth);
  }
  AddStar() {
    let starG: SphereGeometry = new SphereGeometry((Math.random() + this.nebulaVolume / 500) / 2, 8, 10, 10);
    let starM: MeshLambertMaterial = new MeshLambertMaterial({
      emissive: new Color(0xffffff),
      emissiveIntensity: 0
    });
    let star: Mesh = new Mesh(starG, starM);

    for (var i = 0; i < 5000; i++) {
      let starPosX = Math.random() * this.nebulaVolume * 2 - this.nebulaVolume
      let starPosY = Math.random() * this.nebulaVolume * 2 - this.nebulaVolume
      let starPosZ = Math.random() * this.nebulaVolume * 2 - this.nebulaVolume
      star.position.set(starPosX, starPosY, starPosZ);

      let p2p = TwoPointDistance3D(mainScene.position, star.position);
      if (p2p < 500) {
        continue
      } else {
        mainScene.add(star.clone());
      }
    }
  }
  AddSprite() {

  }
  AddLines() {
    let lineG = new Geometry();
    let lineM = new LineBasicMaterial({
      color: new Color(Math.random() * 0xffffff)
    });
    for (var i = 0; i < 1000; i++) {
      let pointPos = new Vector3(
        Math.random() * this.nebulaVolume * 2 - this.nebulaVolume,
        Math.random() * this.nebulaVolume * 2 - this.nebulaVolume,
        Math.random() * this.nebulaVolume * 2 - this.nebulaVolume
      );
      lineG.vertices.push(pointPos);
    }
    let line = new Line(lineG, lineM);
    mainScene.add(line);
  }
  AddSomething() {
    if (this.d > 1000000) {
      this.d = 0;
    } else {
      this.d += 0.02;
    }
    if (this.distance > 2000) {
      this.distance = 0;
    } else {
      this.distance += 0.4;
    }
    // 设置球球的name
    if (this.nameNym > 100000000) {
      this.nameNym = 0;
    } else {
      this.nameNym += 1;
    }
    let posx = Math.cos(this.d * 10) * this.distance;
    let posy = Math.sin(this.d * 100) * this.d * 5;
    let posz = Math.sin(this.d * 10) * this.distance;

    const point: Mesh = new Mesh(this.pointG, new MeshBasicMaterial({
      color: Math.random() * 0xffffff
    }));
    point.name = `main_distance_${this.nameNym}`;
    point.position.set(posx, posy, posz);
    let scale = (Math.random() + 1) * 2;
    point.scale.set(scale, scale, scale);
    mainScene.add(point);
    setTimeout(() => {
      const delObj = mainScene.getObjectByName(point.name);
      delObj && mainScene.remove(delObj);
    }, 300000);
  }
  /**
   * 开始渲染
   */
  Start() {
    this.starting = true;
    renderer.clear();
    // 更新fps监控
    this.stats.update();
    // 渲染主相机
    renderer.setViewport(0, 0, vw, vh)
    renderer.render(mainScene, this.mainCamera);
    // 渲染第二个相机
    //renderer.setViewport(vw / 2, 0, vw / 2, vh)
    //renderer.render(mainScene, this.camera2.camera);

    this.controls.update();
    this.earthRotateDistance += 0.01;
    this.earth.position.set(
      Math.cos(this.earthRotateDistance) * 800,
      0,
      Math.sin(this.earthRotateDistance) * 800
    );
    this.camera2.lookAt(this.earth.position);

    this.sun.rotation.y += 1;
    this.sun.rotation.z += 1;
    // 画一些东西
    //this.AddSomething()

    this.animationHandler = requestAnimationFrame(() => this.Start());
  }
  Pause() {
    this.starting = false;
    this.animationHandler && cancelAnimationFrame(this.animationHandler);
  }
}
export {
  mainScene,
  MainScene
};
