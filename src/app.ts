import * as THREE from 'three'
import './libs/plugins'
import { AppConfig } from './app.config'
import { TwoPointDistance3D } from './utils/tools'
import { mainScene } from './scenes/index'


window.addEventListener('load', () => {
  AppConfig()

  // 相机
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(103, window.innerWidth / window.innerHeight, 0.1, 10000)
  camera.position.set(100, 100, 100)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  mainScene.add(camera)
  // 渲染器
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  const axes: THREE.AxesHelper = new THREE.AxesHelper(1000)
  //mainScene.add(axes)

  const moonGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(30, 70, 70, 70)
  const textureLoader: THREE.TextureLoader = new THREE.TextureLoader()
  const moonTexture: THREE.Texture = textureLoader.load('./texture/moon.jpg', () => {
    console.log('moon.jpg 加载成功！')
  }, undefined, (err: any) => {
    console.log('error: ', err)
  })

  const moonMaterial: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: moonTexture,
    side: THREE.DoubleSide
  })
  const moon: THREE.Mesh = new THREE.Mesh(moonGeometry, moonMaterial)
  mainScene.add(moon)

  const light: THREE.PointLight = new THREE.PointLight(0xffffff, 2, 2000, 1)
  //light.position.set(-500, 0, -500)
  light.lookAt(0, 0, 0)
  mainScene.add(light)

  //添加鼠标控制
  const controls: THREE.OrbitControls = new THREE.OrbitControls(camera, renderer.domElement)
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
  controls.autoRotateSpeed = 0.05
  //设置相机距离原点的最远距离
  controls.minDistance = 10
  //设置相机距离原点的最远距离
  controls.maxDistance = 10000
  //是否开启右键拖拽
  controls.enablePan = true


  let starG: THREE.SphereGeometry = new THREE.SphereGeometry((Math.random() + 1) / 4, 20, 20, 20)
  let starM: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
    emissive: 0x333333,
    emissiveIntensity: 0.1
  })
  for (var i = 0; i < 5000; i++) {
    starM.emissive = new THREE.Color(Math.floor(Math.random() * 0xffffff))
    let star: THREE.Mesh = new THREE.Mesh(starG, starM)
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


  // 旋转角度
  let d = 0
  // 旋转物体 距 旋转点 的距离
  let distance = 200
  // 动起来，让世界为你喝彩
  function Animate() {
    renderer.render(mainScene, camera)
    requestAnimationFrame(Animate)
    controls.update()
    moon.rotateY(0.002)
    moon.rotateZ(0.003)

    if (d > 1000000) {
      d = 0
    } else {
      d += 0.0002
    }
    light.position.set(
      Math.cos(d * 10) * distance,
      0,
      Math.sin(d * 10) * distance
    )
    //camera.position.set(
    //  Math.cos(d) * distance * 2,
    //  0,
    //  Math.sin(d) * distance * 2
    //)
    //camera.lookAt(moon.position)
  }
  Animate()

  window.addEventListener('resize', () => {
    // 以下三行保证 resize 时场景保持不变形
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }, false)

})
