import { Scene, Mesh, Color, MeshLambertMaterial, SphereGeometry, PointLight, AxesHelper, OrbitControls, MeshBasicMaterial, Vector3 } from "three";
import renderer from "../components/Renderer";
import camera from "../components/Camera";
import { TwoPointDistance3D } from "../utils/tools";

// 场景
const mainScene: Scene = new Scene();
// scene.fog = new Fog(0xffffff, 0.1, 1000);
function MainScene() {
  //添加鼠标控制
  const controls: OrbitControls = new OrbitControls(camera, renderer.domElement)
  // 如果使用 Animate 方法时，将此函数删除
  //controls.addEventListener( 'change', render )
  // 使动画循环使用时阻尼或自转 意思是否有惯性
  controls.enableDamping = true
  //动态阻尼系数 就是鼠标拖拽旋转灵敏度
  //controls.dampingFactor = 0.25
  //是否可以缩放
  controls.enableZoom = true
  //是否自动旋转
  controls.autoRotate = true
  controls.autoRotateSpeed = 5
  //设置相机距离原点的最远距离
  controls.minDistance = 10
  //设置相机距离原点的最远距离
  controls.maxDistance = 10000
  //是否开启右键拖拽
  controls.enablePan = true

  //const axes: AxesHelper = new AxesHelper(1000)
  //mainScene.add(axes)

  const light: PointLight = new PointLight(0xffffff, 2, 2000, 1)
  //light.position.set(-500, 0, -500)
  light.lookAt(0, 0, 0)
  mainScene.add(light)


  let starG: SphereGeometry = new SphereGeometry((Math.random() + 1) / 5, 20, 20, 20)
  let starM: MeshLambertMaterial = new MeshLambertMaterial({
    emissive: 0xffffff,
    emissiveIntensity: 0.1
  })
  for (var i = 0; i < 10000; i++) {
    starM.emissive = new Color(Math.floor(Math.random() * 0xffffff))
    let star: Mesh = new Mesh(starG, starM)
    star.position.set(
      Math.random() * 1000 - 500,
      Math.random() * 1000 - 500,
      Math.random() * 1000 - 500
    )
    let p2p = TwoPointDistance3D(mainScene.position, star.position)
    if (p2p > 500 || p2p < 50) {
      continue
    } else {
      mainScene.add(star)
    }
  }

  const sphereG: SphereGeometry = new SphereGeometry(5, 20, 20)
  const sphereM: MeshBasicMaterial = new MeshBasicMaterial({
    color: 0xff0000
  })
  const sphere: Mesh = new Mesh(sphereG, sphereM);
  sphere.position.set(150, 0, 0)
  mainScene.add(sphere);



  const pointG: SphereGeometry = new SphereGeometry(1, 20, 20)



  // 旋转角度
  let d = 0
  // 旋转物体 距 旋转点 的距离
  let distance = 0
  let linePoint = 0
  let nameNym = 0
  // 动起来，让世界为你喝彩
  function Animate() {
    renderer.render(mainScene, camera)
    requestAnimationFrame(Animate)
    controls.update()

    if (d > 1000000) {
      d = 0
    } else {
      d += 0.02
    }
    if (distance > 500) {
      distance = 0
    } else {
      distance += 0.0001
    }
    light.position.set(
      Math.cos(d * 10) * distance,
      0,
      Math.sin(d * 10) * distance
    )

    let posx = Math.cos(d * 10) * linePoint
    let posy = Math.sin(nameNym) * 20
    let posz = Math.sin(d * 10) * linePoint
    sphere.position.set(posx, posy, posz)
    sphereM.color = new Color(Math.random() * 0xffffff);


    if (linePoint > 1000) {
      linePoint = 0
    } else {
      // 控制点的密度
      linePoint += 0.05
    }
    if (nameNym > 100000000) {
      nameNym = 0
    } else {
      nameNym += 1
    }
    const point: Mesh = new Mesh(pointG, new MeshBasicMaterial({
      color: Math.random() * 0xffffff
    }));
    point.name = `linePoint_${nameNym}`
    point.position.set(posx, posy, posz)
    mainScene.add(point);
    setTimeout(() => {
      const delObj = mainScene.getObjectByName(point.name)
      delObj && mainScene.remove(delObj);
    }, 30000)
  }
  Animate()
}
export {
  mainScene,
  MainScene
};
