import { Scene, Mesh, Color, MeshLambertMaterial, SphereGeometry, PointLight, AxesHelper, OrbitControls, MeshBasicMaterial, Vector3, Object3D } from "three";
import renderer from "../components/Renderer";
import camera from "../components/Camera";
import { TwoPointDistance3D } from "../utils/tools";

// 场景
const mainScene: Scene = new Scene();
// scene.fog = new Fog(0xffffff, 0.1, 1000);

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

  starting: boolean = false;
  constructor() {
    this.light = new PointLight(0xffffff, 2, 2000, 1);
    this.controls = new OrbitControls(camera, renderer.domElement);
    this.pointG = new SphereGeometry(1, 20, 20);
  }
  Init() {
    this.InitLight();
    this.InitControls();
    //this.AddStar();
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
    this.controls.autoRotateSpeed = 1;
    //设置相机距离原点的最远距离
    this.controls.minDistance = 10;
    //设置相机距离原点的最远距离
    this.controls.maxDistance = 10000;
    //是否开启右键拖拽
    this.controls.enablePan = true;
  }
  AddStar() {
    let starG: SphereGeometry = new SphereGeometry((Math.random() + 1) / 2, 10, 10, 10);
    let starM: MeshLambertMaterial = new MeshLambertMaterial({
      emissive: new Color(Math.floor(Math.random() * 0xffffff)),
      emissiveIntensity: 0.1,
      color: 0xffffff
    });
    let star: Mesh = new Mesh(starG, starM);
    for (var i = 0; i < 20000; i++) {
      //starM.color = new Color(Math.floor(Math.random() * 0xffffff))
      star.position.set(
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500
      );
      let p2p = TwoPointDistance3D(mainScene.position, star.position);
      if (p2p > 500 || p2p < 50) {
        continue
      } else {
        mainScene.add(star.clone());
      }
    }
  }
  Start() {
    this.starting = true;
    renderer.render(mainScene, camera);
    this.animationHandler = requestAnimationFrame(() => this.Start());
    this.controls.update();

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
    let posy = Math.sqrt(this.distance) * Math.sin(this.d) * 10;
    let posz = Math.sin(this.d * 10) * this.distance;
    this.light.position.set(posx, 100, posz);

    const point: Mesh = new Mesh(this.pointG, new MeshBasicMaterial({
      color: Math.random() * 0xffffff
    }));
    point.name = `main_distance_${this.nameNym}`;
    point.position.set(posx, posy, posz);
    let scale = (Math.random() + 1) * 2;
    console.log(scale);
    point.scale.set(scale, scale, scale);
    mainScene.add(point);
    setTimeout(() => {
      const delObj = mainScene.getObjectByName(point.name);
      delObj && mainScene.remove(delObj);
    }, 300000);
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
