import './libs/plugins';
import { AppConfig } from './app.config';
import camera from './components/Camera';
import renderer from './components/Renderer';
import { MainScene } from './scenes/main';

window.addEventListener('load', () => {
  AppConfig();

  let mainScene: MainScene = new MainScene();
  mainScene.Init();
  mainScene.Start();

  document.querySelector("#start")?.addEventListener("click", () => {
    mainScene.Start();
  })
  document.querySelector("#pause")?.addEventListener("click", () => {
    mainScene.Pause();
  })
  // 有问题
  //document.querySelector("#reset")?.addEventListener("click", () => {
  //  mainScene.Reset();
  //})


  window.addEventListener('resize', () => {
    // 以下三行保证 resize 时场景保持不变形
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, false)
})
