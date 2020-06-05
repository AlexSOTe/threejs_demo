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
  pointG: SphereGeometry;
  animationHandler?: number;

  // 旋转角度
  d: number = 0;
  // 旋转物体 距 旋转点 的距离
  distance: number = 0;
  linePoint: number = 0;
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
    this.AddStar();
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
    this.controls.autoRotateSpeed = 5;
    //设置相机距离原点的最远距离
    this.controls.minDistance = 10;
    //设置相机距离原点的最远距离
    this.controls.maxDistance = 10000;
    //是否开启右键拖拽
    this.controls.enablePan = true;
  }
  AddStar() {
    let starG: SphereGeometry = new SphereGeometry((Math.random() + 1) / 1, 10, 10, 10);
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
    if (this.distance > 500) {
      this.distance = 0;
    } else {
      this.distance += 0.0001;
    }
    if (this.linePoint > 1000) {
      this.linePoint = 0;
    } else {
      // 控制点的密度
      this.linePoint += 0.1;
    }
    if (this.nameNym > 100000000) {
      this.nameNym = 0;
    } else {
      this.nameNym += 1;
    }
    this.light.position.set(
      Math.cos(this.d * 10) * this.distance,
      0,
      Math.sin(this.d * 10) * this.distance
    );

    let posx = Math.cos(this.d * 10) * this.linePoint;
    let posy = this.nameNym * 0.03 * Math.sin(this.nameNym);
    let posz = Math.sin(this.d * 10) * this.linePoint;

    const point: Mesh = new Mesh(this.pointG, new MeshBasicMaterial({
      color: Math.random() * 0xffffff
    }));

    point.name = `main_linePoint_${this.nameNym}`;
    point.position.set(posx, posy, posz);
    mainScene.add(point);
    setTimeout(() => {
      const delObj = mainScene.getObjectByName(point.name);
      delObj && mainScene.remove(delObj);
    }, 60000);
  }
  Pause() {
    this.starting = false;
    this.animationHandler && cancelAnimationFrame(this.animationHandler);
  }
  Reset() {
    this.starting = false;
    this.Pause();
    this.d = 0;
    this.distance = 0;
    this.linePoint = 0;
    this.nameNym = 0;
    mainScene.children.map((v, i, a) => {
      if (/^main_/.test(v.name)) mainScene.remove(v);
    });
    renderer.clear();
  }
}
export {
  mainScene,
  MainScene
};
