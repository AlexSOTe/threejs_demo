import { Scene, Mesh, Color, MeshLambertMaterial, SphereGeometry, PointLight, AxesHelper, OrbitControls, MeshBasicMaterial, Vector3, Object3D, ImageUtils, MeshPhongMaterial, Fog, MeshPhysicalMaterial } from "three";
import renderer from "../components/Renderer";
import camera from "../components/Camera";
import { TwoPointDistance3D } from "../utils/tools";

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

  // 描点时，描点位置和原点连线的旋转角度
  d: number = 0;
  // 控制点的密度，越小越密集
  distance: number = 0;
  // 星星的名字
  nameNym: number = 0;
  // 是否正在播放
  starting: boolean = false;
  // 星云体积
  nebulaVolume: number = 10000;

  constructor() {
    this.light = new PointLight(0xffffff, 20, 10000, 1);
    this.controls = new OrbitControls(camera, renderer.domElement);
    this.pointG = new SphereGeometry(1, 20, 20);
  }
  Init() {
    this.InitLight();
    this.InitControls();
    this.AddStar();
    this.AddSun();
    // 添加坐标轴
    //mainScene.add(new AxesHelper(1000));
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
    this.controls.autoRotateSpeed = 0.2;
    //设置相机距离原点的最远距离
    this.controls.minDistance = 0.1;
    //设置相机距离原点的最远距离
    this.controls.maxDistance = 10000;
    //是否开启右键拖拽
    this.controls.enablePan = true;
  }
  AddSun() {
    let texture = ImageUtils.loadTexture('texture/sun.jpg');
    let sunG: SphereGeometry = new SphereGeometry(200, 100, 100);
    let sunM: MeshPhysicalMaterial = new MeshPhysicalMaterial({
      emissive: new Color(0xffffff), // emissive默认黑色，设置为白色
      emissiveMap: texture,
      emissiveIntensity: 1.1,
      //wireframe: true,
    });
    sunM.opacity = 0.3;
    let sun: Mesh = new Mesh(sunG, sunM);
    sun.position.set(0, 0, 0);
    mainScene.add(sun);
  }
  AddStar() {
    let starG: SphereGeometry = new SphereGeometry((Math.random() + this.nebulaVolume / 500) / 2, 8, 10, 10);
    let starM: MeshLambertMaterial = new MeshLambertMaterial({
      emissive: new Color(0xffffff),
      emissiveIntensity: 0
    });
    let star: Mesh = new Mesh(starG, starM);
    for (var i = 0; i < 20000; i++) {
      //starM.color = new Color(Math.floor(Math.random() * 0xffffff))
      star.position.set(
        Math.random() * this.nebulaVolume * 2 - this.nebulaVolume,
        Math.random() * this.nebulaVolume * 2 - this.nebulaVolume,
        Math.random() * this.nebulaVolume * 2 - this.nebulaVolume
      );
      let p2p = TwoPointDistance3D(mainScene.position, star.position);
      if (p2p < 500) {
        continue
      } else {
        mainScene.add(star.clone());
      }
    }
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
  Start() {
    this.starting = true;
    renderer.render(mainScene, camera);
    this.animationHandler = requestAnimationFrame(() => this.Start());
    this.controls.update();

    // // 画线
    // this.AddSomething()
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
